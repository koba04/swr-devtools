import { injectSWRCache, isMetaCache } from "./swr-cache";
import { SWRCache } from "./devtools-cache";

export const launch = (cache: SWRCache) => {
  injectSWRCache(cache, (key: string, value: any) => {
    if (isMetaCache(key)) {
      return;
    }
    window.postMessage(
      { __SWR_DEVTOOLS__: { cacheData: { key, value } } },
      "*"
    );
  });
};
