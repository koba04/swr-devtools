import { useState, useEffect } from "react";
import { CacheInterface } from "swr";

export type CacheData = {
  id: number;
  key: string;
  data: any;
  isValidating: boolean;
  error: string;
  timestamp: Date;
  timestampString: string;
};

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

const cacheLogsStore = new Set<any>();
const latestCacheStore = new Map<any, any>();

let id = 1;

const retrieveCache = (cache: CacheInterface): [CacheData[], CacheData[]] => {
  const date = new Date();
  const retrieveCacheData = cache
    .keys()
    .filter((key) => !key.startsWith("validating@") && !key.startsWith("err@"))
    .map((key) => {
      const data = cache.get(key);
      const devToolsCache = latestCacheStore.get(data);
      if (devToolsCache) {
        return devToolsCache;
      }

      const isValidating = cache.get(`validating@${key}`);
      const error = cache.get(`err@${key}`);
      ++id;
      const cacheData = {
        id,
        key,
        data,
        isValidating,
        error,
        timestamp: date,
        timestampString: formatTime(date),
      };
      latestCacheStore.set(data, cacheData);
      cacheLogsStore.add(cacheData);
      return cacheData;
    });
  return [retrieveCacheData, Array.from(cacheLogsStore).reverse()];
};

export const useSWRCache = (
  cache: CacheInterface
): [CacheData[], CacheData[]] => {
  const [cacheData, setCacheData] = useState<[CacheData[], CacheData[]]>([
    [],
    [],
  ]);

  useEffect(() => {
    const unsubscribe = cache.subscribe(() => {
      setCacheData(retrieveCache(cache));
    });
    return () => unsubscribe();
  }, []);
  return cacheData;
};
