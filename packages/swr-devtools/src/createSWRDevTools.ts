// We cannot import React nad use hooks that SWR provides because this runs on the application side,
// we have to use the same React instance with the application
import { Middleware, Cache, unstable_serialize } from "swr";

import { injectSWRCache } from "./swr-cache";

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

// TOOD: we have to support more types
const convertToSerializableObject = (value: any) => {
  return value instanceof Error ? { message: value.message } : value;
};

const convertValue = (value: any) => {
  if (typeof value !== "object" || value === null) return value;
  if (Array.isArray(value)) {
    return value.map(convertToSerializableObject);
  }
  return Object.keys(value).reduce(
    (acc, cacheKey) => ({
      ...acc,
      [cacheKey]: convertToSerializableObject(value[cacheKey]),
    }),
    {}
  );
};

const inject = (cache: Cache) =>
  injectSWRCache(cache, (key: string, value: any) => {
    window.postMessage(
      {
        type: "updated_swr_cache",
        payload: {
          key,
          value: convertValue(value),
        },
      },
      "*"
    );
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

  const swrdevtools: Middleware = (useSWRNext) => (key, fn, config) => {
    //    console.log({ config: JSON.stringify(config) });
    // use the same React instance with the application
    const { useLayoutEffect, useEffect, useRef } =
      typeof window !== "undefined" &&
      // @ts-expect-error
      typeof window.__SWR_DEVTOOLS_REACT__ !== "undefined"
        ? // @ts-expect-error
          window.__SWR_DEVTOOLS_REACT__
        : dummyHooks;

    useLayoutEffect(() => {
      window.postMessage({ type: "initialized" }, "*");
    }, []);
    // FIXME: I'll use mutate to support mutating from a devtool panel.
    // const { cache /* , mutate */ } = useSWRConfig();
    const cache = config.cache;

    if (!injected.has(cache)) {
      inject(cache);
      injected.add(cache);
    }

    const requestIdRef = useRef(0);
    const serializedKey = unstable_serialize(key);

    useEffect(() => {
      return () => {
        // When the key changes or unmounts, ongoing requests should be discarded.
        // This only affects React 17.
        // https://github.com/vercel/swr/blob/bcc39321dd12133a0c42207ef4bdef7e214d9b1e/core/use-swr.ts#L245-L254
        if (requestIdRef.current) {
          events.emit("request_discarded", {
            key: serializedKey,
            id: requestIdRef.current,
          });
          events.emit("request_discarded", {
            key: serializedKey,
            id: requestIdRef.current,
          });
        }
      };
    }, [serializedKey]);

    const config_ = Object.keys(config)
      // @ts-expect-error
      .filter((k) => typeof config[k] !== "function")
      .filter((k) => k !== "cache" && k !== "use")
      .reduce((acc, cur) => {
        return {
          ...acc,
          // @ts-expect-error
          [cur]: config[cur],
        };
      }, {});

    const wrappedFn = fn
      ? (...args: any) => {
          const id = ~~(Math.random() * 1e8);
          events.emit("request_start", {
            key: unstable_serialize(args[0]),
            id,
            config: config_,
          });
          window.postMessage(
            {
              type: "request_start",
              payload: {
                key: unstable_serialize(args[0]),
                id,
                config: config_,
              },
            },
            "*"
          );
          try {
            const res = fn(...args);
            if (res && "then" in res && typeof res.then === "function") {
              return res
                .then((r) => {
                  requestIdRef.current = id;
                  const payload = {
                    key: unstable_serialize(args[0]),
                    id,
                    data: convertToSerializableObject(r),
                  };
                  events.emit("request_success", payload);
                  window.postMessage(
                    {
                      type: "request_success",
                      payload,
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
                    error: convertToSerializableObject(e),
                  };
                  events.emit("request_error", payload);
                  window.postMessage(
                    {
                      type: "request_error",
                      payload,
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
          payload: {
            key: unstable_serialize(args[0]),
            id: requestIdRef.current,
          },
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
