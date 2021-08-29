import React from "react";
import { useSWRConfig, SWRConfig, Middleware } from "swr";
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
