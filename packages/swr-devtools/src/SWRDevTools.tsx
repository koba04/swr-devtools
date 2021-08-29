import React from "react";
import { SWRConfig, Middleware } from "swr";
import { SWRCache } from "./devtools-cache";

import { injectSWRCache, isMetaCache } from "./swr-cache";

const injected = new WeakSet();

const inject = (cache: SWRCache) =>
  injectSWRCache(cache, (key: string, value: any) => {
    if (isMetaCache(key)) {
      return;
    }
    window.postMessage(
      { __SWR_DEVTOOLS__: { cacheData: { key, value } } },
      "*"
    );
  });

const swrdevtools: Middleware = (useSWRNext) => (key, fn, config) => {
  // @ts-expect-error we need to move the cache type from InternalConfiguration to PublicConfiguration to use `cache` here.
  const { cache } = config;
  if (!injected.has(cache)) {
    inject(cache);
    injected.add(cache);
  }
  return useSWRNext(key, fn, config);
};

export const SWRDevTools = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={{ use: [swrdevtools] }}>{children}</SWRConfig>;
};
