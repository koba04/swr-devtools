import { Cache } from "swr";

export type DevToolsCacheData = {
  key: string;
  data?: unknown;
  isValidating?: boolean;
  isLoading?: boolean;
  error?: unknown;
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

export const isInfiniteCache = (key: string) => {
  return /^\$inf\$/.test(key);
};

export const getInfiniteCacheKey = (key: string) => {
  const match = key.match(/^\$inf\$(?<cacheKey>.*)?/);
  return match?.groups?.cacheKey ?? key;
};

const getErrorCacheKey = (key: string) => {
  const match = key.match(/^\$err\$(?<cacheKey>.*)?/);
  return match?.groups?.cacheKey ?? key;
};

const isV2CacheData = (data: any) => {
  return "isValidating" in data && "isLoading" in data;
};

const isV1MetaCache = (key: string) => {
  return /^\$swr\$/.test(key);
};

// TODO: Support $req$ for isValidationg and useSWRInfinite keys
// refs. https://github.com/koba04/swr-devtools/issues/48
export const convertToDevToolsCacheData = (
  key: string,
  value: any,
  cache: Cache
): { key: string; value: Partial<DevToolsCacheData> } => {
  if (value !== undefined && isV2CacheData(value)) {
    // SWR v2
    return {
      key,
      value,
    };
  } else if (value !== undefined && isV1MetaCache(key)) {
    // SWR ^1.3.0 ($swr$ cache key)
    const v1CacheKey = key.replace(/^\$swr\$/, "");
    return {
      key: v1CacheKey,
      value: {
        data: cache.get(v1CacheKey),
        error: value.error,
      },
    };
  } else if (isErrorCache(key)) {
    // SWR <1.3.0
    return {
      key: getErrorCacheKey(key),
      value: {
        error: value,
      },
    };
  }
  return {
    key,
    value: { data: value },
  };
};
