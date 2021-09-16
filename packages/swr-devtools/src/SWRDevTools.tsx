import React, { useLayoutEffect } from "react";
import { useSWRConfig, SWRConfig, Middleware, Cache } from "swr";

import { injectSWRCache, isMetaCache } from "./swr-cache";

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
          value,
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
