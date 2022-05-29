import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useSWRConfig,
  SWRConfig,
  Middleware,
  Cache,
  unstable_serialize,
} from "swr";

import { injectSWRCache, isMetaCache } from "./swr-cache";

type EventListener = (...args: any[]) => void;

class EventEmitter {
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
      };
    }
  | {
      type: "request_error";
      payload: {
        key: string;
        id: number;
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

const inject = (cache: Cache) =>
  injectSWRCache(cache, (key: string, value: any) => {
    if (isMetaCache(key)) {
      return;
    }
    window.postMessage(
      {
        type: "updated_swr_cache",
        payload: {
          key,
          value: Object.keys(value).reduce(
            (acc, cacheKey) => ({
              ...acc,
              [cacheKey]: convertToSerializableObject(value[cacheKey]),
            }),
            {}
          ),
        },
      },
      "*"
    );
  });

const createSWRDevtools = () => {
  const events = new EventEmitter();

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

    const requestIdRef = useRef<number>(0);
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
              payload: {
                key: unstable_serialize(args[0]),
                id,
              },
            },
            "*"
          );
          try {
            const res = fn.apply(null, args);
            if (res && "then" in res && typeof res.then === "function") {
              return res
                .then((r) => {
                  requestIdRef.current = id;
                  return r;
                })
                .catch((e) => {
                  requestIdRef.current = id;
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
    const onSuccess = (...args: any) => {
      events.emit("request_success", {
        key: unstable_serialize(args[1]),
        id: requestIdRef.current,
      });
      window.postMessage(
        {
          type: "request_success",
          payload: {
            key: unstable_serialize(args[1]),
            id: requestIdRef.current,
          },
        },
        "*"
      );
      return config.onSuccess ? config.onSuccess.apply(null, args) : null;
    };
    const onError = (...args: any) => {
      events.emit("request_error", {
        key: unstable_serialize(args[1]),
        id: requestIdRef.current,
      });
      window.postMessage(
        {
          type: "request_error",
          payload: {
            key: unstable_serialize(args[1]),
            id: requestIdRef.current,
          },
        },
        "*"
      );
      return config.onError ? config.onError.apply(null, args) : null;
    };
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
      onSuccess,
      onError,
      onDiscarded,
    });
  };
  return [swrdevtools, events] as const;
};

export type SWRDevToolsContextValue = { events: EventEmitter | null };
export const SWRDevToolsContext = React.createContext<SWRDevToolsContextValue>({
  events: null,
});

export const SWRDevTools = ({ children }: { children: React.ReactNode }) => {
  const [swrdevtools, events] = useState(() => createSWRDevtools())[0];
  return (
    <SWRDevToolsContext.Provider value={{ events }}>
      <SWRConfig value={{ use: [swrdevtools] }}>{children}</SWRConfig>
    </SWRDevToolsContext.Provider>
  );
};
