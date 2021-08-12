import type { Cache } from "swr";
import { spySWRCache, isMetaCache } from "swr-devtools/lib/cache";

// @ts-expect-error
window.__SWR_DEVTOOLS__ = {
  launch(cache: Cache) {
    spySWRCache(cache, (key: string, value: any) => {
      if (isMetaCache(key)) {
        return;
      }
      window.postMessage({ cacheData: { key, value } }, "*");
    });
  },
};
