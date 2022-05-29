import React, { useLayoutEffect } from "react";
import { useSWRConfig, SWRConfig, Middleware, Cache } from "swr";

import { injectSWRCache } from "./swr-cache";

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
    };

// TOOD: we have to support more types
const convertToSerializableObject = (value: any) => {
  return value instanceof Error ? { message: value.message } : value;
};

const inject = (cache: Cache) =>
  injectSWRCache(cache, (key: string, value: any) => {
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
  return useSWRNext(key, fn, config);
};

export const SWRDevTools = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={{ use: [swrdevtools] }}>{children}</SWRConfig>;
};
