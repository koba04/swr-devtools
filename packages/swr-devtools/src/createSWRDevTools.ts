// We cannot import React nad use hooks that SWR provides because this runs on the application side,
// we have to use the same React instance with the application
import { type Middleware, type Cache, useSWRConfig } from "swr";

import { injectSWRCache, serializePayload } from "./swr-cache";
import { serialize as unstable_serialize } from "./swr/serialize";

type EventListener = (...args: any[]) => void;

export class EventEmitter {
  listeners: EventListener[] = [];
  subscribe(fn: EventListener) {
    this.listeners.push(fn);
    return () => {
      const index = this.listeners.indexOf(fn);
      this.listeners.splice(index, 1);
    };
  }
  emit(...args: any[]) {
    this.listeners.forEach((fn) => fn(...args));
  }
}

const debug = (...args: any[]) => {
  // console.log(...args);
};

const injected = new WeakSet();

export type DevToolsMessage =
  | {
      type: "updated_swr_cache";
      payload: {
        key: string;
        value: any;
      };
    }
  | {
      type: "initialized";
    }
  | {
      type: "request_start";
      payload: {
        key: string;
        id: number;
      };
    }
  | {
      type: "request_success";
      payload: {
        key: string;
        id: number;
        data: any;
      };
    }
  | {
      type: "request_error";
      payload: {
        key: string;
        id: number;
        error: any;
      };
    }
  | {
      type: "request_discarded";
      payload: {
        key: string;
        id: number;
      };
    };

let devToolsPanelIsOpen = false;

const inject = (cache: Cache) =>
  injectSWRCache(cache, (key: string, value: any) => {
    if (devToolsPanelIsOpen) {
      window.postMessage(
        {
          type: "updated_swr_cache",
          payload: serializePayload({
            key,
            value,
          }),
        },
        "*"
      );
    }
  });

const noop = () => {
  /* noop */
};
const dummyHooks = {
  useLayoutEffect: noop,
  useEffect: noop,
  useRef: <T>(a: T) => ({
    current: a,
  }),
};

export const createSWRDevtools = () => {
  const events = new EventEmitter();

  if (typeof window !== "undefined") {
    window.addEventListener("message", (e) => {
      if (e.data?.type === "panelshow") {
        devToolsPanelIsOpen = true;
      } else if (e.data?.type === "panelhide") {
        devToolsPanelIsOpen = false;
      } else if (e.data?.type === "load") {
        devToolsPanelIsOpen = e.data?.payload?.panelIsOpen;
      }
    });
  }

  // use the same React instance with the application
  const { useLayoutEffect, useEffect, useRef } =
    typeof window !== "undefined" &&
    // @ts-expect-error
    typeof window.__SWR_DEVTOOLS_REACT__ !== "undefined"
      ? // @ts-expect-error
        window.__SWR_DEVTOOLS_REACT__
      : dummyHooks;

  const swrdevtools: Middleware = (useSWRNext) => (key, fn, config) => {
    useLayoutEffect(() => {
      window.postMessage({ type: "initialized" }, "*");
    }, []);

    // FIXME: I'll use mutate to support mutating from a devtool panel.
    const { cache /* , mutate */ } = useSWRConfig();

    if (!injected.has(cache)) {
      inject(cache);
      injected.add(cache);
    }

    const requestIdRef = useRef(0);
    const serializedKey = unstable_serialize(key);

    useEffect(() => {
      return () => {
        if (!devToolsPanelIsOpen) return;
        // When the key changes or unmounts, ongoing requests should be discarded.
        // This only affects React 17.
        // https://github.com/vercel/swr/blob/bcc39321dd12133a0c42207ef4bdef7e214d9b1e/core/use-swr.ts#L245-L254
        if (requestIdRef.current) {
          events.emit("request_discarded", {
            key: serializedKey,
            id: requestIdRef.current,
          });
          window.postMessage(
            {
              type: "request_discarded",
              payload: serializePayload({
                key: serializedKey,
                id: requestIdRef.current,
              }),
            },
            "*"
          );
        }
      };
    }, [serializedKey]);

    debug({ devToolsPanelIsOpen });

    // If DevToolsPanel is not opened, we don't do anything.
    if (!devToolsPanelIsOpen) {
      return useSWRNext(key, fn, config);
    }

    const wrappedFn = fn
      ? (...args: any) => {
          const id = ~~(Math.random() * 1e8);
          events.emit("request_start", {
            key: unstable_serialize(args[0]),
            id,
          });
          window.postMessage(
            {
              type: "request_start",
              payload: serializePayload({
                key: unstable_serialize(args[0]),
                id,
              }),
            },
            "*"
          );
          try {
            const res = fn(...args);
            if (
              res &&
              typeof res === "object" &&
              "then" in res &&
              typeof res.then === "function"
            ) {
              return res
                .then((r) => {
                  requestIdRef.current = id;
                  const payload = {
                    key: unstable_serialize(args[0]),
                    id,
                    data: r,
                  };
                  events.emit("request_success", payload);
                  window.postMessage(
                    {
                      type: "request_success",
                      payload: serializePayload(payload),
                    },
                    "*"
                  );
                  return r;
                })
                .catch((e) => {
                  requestIdRef.current = id;
                  const payload = {
                    key: unstable_serialize(args[0]),
                    id,
                    error: e,
                  };
                  events.emit("request_error", payload);
                  window.postMessage(
                    {
                      type: "request_error",
                      payload: serializePayload(payload),
                    },
                    "*"
                  );
                  throw e;
                });
            }
            requestIdRef.current = id;
            return res;
          } catch (e) {
            requestIdRef.current = id;
            throw e;
          }
        }
      : fn;
    // FIXME: we should get the id of discarded fetcher request. requestIdRef is the latest id of ongoing requests
    const onDiscarded = (...args: any) => {
      events.emit("request_discarded", {
        key: unstable_serialize(args[0]),
        id: requestIdRef.current,
      });
      window.postMessage(
        {
          type: "request_discarded",
          payload: serializePayload({
            key: unstable_serialize(args[0]),
            id: requestIdRef.current,
          }),
        },
        "*"
      );
      return config.onDiscarded ? config.onDiscarded.apply(null, args) : null;
    };

    return useSWRNext(key, wrappedFn, {
      ...config,
      onDiscarded,
    });
  };
  return [swrdevtools, events] as const;
};
