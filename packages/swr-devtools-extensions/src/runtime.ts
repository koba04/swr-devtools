import type { Cache } from "swr";
import { injectSWRCache, isMetaCache } from "swr-devtools";

// @ts-expect-error
window.__SWR_DEVTOOLS__ = {
  launch(cache: Cache) {
    injectSWRCache(cache, (key: string, value: any) => {
      if (isMetaCache(key)) {
        return;
      }
      window.postMessage(
        { __SWR_DEVTOOLS__: { cacheData: { key, value } } },
        "*"
      );
    });
  },
};
