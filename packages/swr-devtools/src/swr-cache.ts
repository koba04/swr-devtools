import { SWRCache } from "./devtools-cache";

export type SWRCacheData = {
  id: number;
  key: string;
  data: any;
  isValidating: boolean;
  error: string;
  timestamp: Date;
  timestampString: string;
};

export const injectSWRCache = (
  cache: SWRCache,
  watcher: (key: string, value: any) => void
): void => {
  // intercept operations modifying the cache store
  const originalSet = cache.set;
  cache.set = (key: string, value: any) => {
    watcher(key, value);
    return originalSet.call(cache, key, value);
  };
  const originalDelete = cache.delete;
  cache.delete = (key: string) => {
    watcher(key, undefined);
    return originalDelete.call(cache, key);
  };
};

export const isMetaCache = (key: string) => {
  return /^\$(?:req|err|ctx|len)\$/.test(key);
};

export const isInfiniteCache = (key: string) => {
  return /^\$inf\$/.test(key);
};

export const getInfiniteCacheKey = (key: string) => {
  const match = key.match(/^\$inf\$(?<cacheKey>.*)?/);
  console.log(match, key);
  return match?.groups?.cacheKey ?? key;
};
