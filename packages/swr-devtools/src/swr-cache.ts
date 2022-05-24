import { Cache } from "swr";

export type SWRCacheData = {
  key: string;
  cache: any;
  isValidating: boolean;
  error: string;
  timestamp: Date;
  timestampString: string;
};

export const injectSWRCache = (
  cache: Cache,
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
  return /^\$(?:req|ctx|len)\$/.test(key);
};

export const isErrorCache = (key: string) => {
  return /^\$err\$/.test(key);
};

export const getErrorCacheKey = (key: string) => {
  const match = key.match(/^\$err\$(?<cacheKey>.*)?/);
  return match?.groups?.cacheKey ?? key;
};

export const isInfiniteCache = (key: string) => {
  return /^\$inf\$/.test(key);
};

export const getInfiniteCacheKey = (key: string) => {
  const match = key.match(/^\$inf\$(?<cacheKey>.*)?/);
  return match?.groups?.cacheKey ?? key;
};

export const isV2CacheData = (data: any) => {
  return "isValidating" in data && "isLoading" in data;
};

export const isV1MetaCache = (key: string) => {
  return /^\$swr\$/.test(key);
};

export const convertCacheDataFromV1ToV2 = (
  key: string,
  data: any,
  cache: Cache
) => {
  const v1CacheKey = key.replace(/^\$swr\$/, "");
  return [
    v1CacheKey,
    {
      data: cache.get(v1CacheKey),
      error: data.error,
    },
  ] as const;
};
