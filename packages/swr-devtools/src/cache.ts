import { useState, useEffect } from "react";
import { CacheInterface } from "swr";

export type SWRCacheData = {
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

const cacheHistory = new Map<string, any>();
const proccessedCacheData = new Map<any, any>();

const getCacheHistoryKey = (key: string, timestamp: Date) =>
  `${key}__${timestamp.getTime()}`;

let id = 1;

const retrieveCache = (
  cache: CacheInterface
): [SWRCacheData[], SWRCacheData[]] => {
  const date = new Date();
  const retrieveCacheData = cache
    .keys()
    // filter meta data in a cache store
    // ctx and len are keys used in use-swr-infinite
    .filter((key) => !/^(?:validating|err|ctx|len)@/.test(key))
    // v1 (beta)
    .filter((key) => !/^\$(?:req|err|ctx|len)\$/.test(key))
    .map((key) => {
      const data = cache.get(key);

      const isValidating = cache.get(`validating@${key}`);
      const error = cache.get(`err@${key}`);
      ++id;
      const cacheData = proccessedCacheData.get(data) || {
        id,
        key,
        data,
        isValidating,
        error,
        timestamp: date,
        timestampString: formatTime(date),
      };
      proccessedCacheData.set(data, cacheData);
      const cacheHistoryKey = getCacheHistoryKey(key, cacheData.timestamp);
      if (!cacheHistory.get(cacheHistoryKey)) {
        cacheHistory.set(cacheHistoryKey, cacheData);
      }
      return cacheData;
    });
  return [
    retrieveCacheData,
    Array.from(cacheHistory.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .reverse(),
  ];
};

export const useSWRCache = (
  cache: CacheInterface
): [SWRCacheData[], SWRCacheData[]] => {
  const [cacheData, setCacheData] = useState<[SWRCacheData[], SWRCacheData[]]>([
    [],
    [],
  ]);

  useEffect(() => {
    const unsubscribe = cache.subscribe(() => {
      setCacheData(retrieveCache(cache));
    });
    return () => unsubscribe();
  }, [cache]);
  return cacheData;
};
