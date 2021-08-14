import type { CacheInterface } from "swr";

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
  cache: CacheInterface,
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
  return (
    // ctx and len are keys used in use-swr-infinite
    /^(?:validating|err|ctx|len)@/.test(key) ||
    // v1 (beta)
    /^\$(?:req|err|ctx|len)\$/.test(key)
  );
};
