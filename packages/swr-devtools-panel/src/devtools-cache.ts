import { useState, useEffect } from "react";
import { Cache } from "swr";

import {
  getErrorCacheKey,
  injectSWRCache,
  isErrorCache,
  isMetaCache,
  SWRCacheData,
} from "swr-devtools/lib/swr-cache";

type Subscribe = (fn: (key: string, value: any) => void) => () => void;

const createDevToolsCache = (cache: Cache) => {
  let listeners: Array<(key: string, value: any) => void> = [];
  const subscribe: Subscribe = (callback) => {
    listeners.push(callback);
    return () => {
      listeners = [];
    };
  };
  injectSWRCache(cache, (key: string, value: any) => {
    console.log("inject", { key, value });
    if (isMetaCache(key)) {
      return;
    }
    listeners.forEach((listener) => {
      listener(key, value);
    });
  });
  return subscribe;
};

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

const cacheHistory = new Map<string, any>();
const currentCacheData = new Map<string, any>();

const getCacheHistoryKey = (key: string, timestamp: Date) =>
  `${key}__${timestamp.getTime()}`;

const sortCacheDataFromLatest = (cacheData: Map<string, any>) => {
  return Array.from(cacheData.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .reverse();
};

// TODO: this is a draft implementation
const toJSON = (value: any) => {
  return value instanceof Error ? { message: value.message } : value;
};

const retrieveCache = (
  key: string,
  value: any
): [SWRCacheData[], SWRCacheData[]] => {
  const date = new Date();

  const data = toJSON(value);
  currentCacheData.set(key, {
    key,
    cache: data,
    timestamp: date,
    timestampString: formatTime(date),
  });

  const cacheHistoryKey = getCacheHistoryKey(key, date);
  cacheHistory.set(cacheHistoryKey, currentCacheData.get(key));

  return [
    sortCacheDataFromLatest(currentCacheData),
    sortCacheDataFromLatest(cacheHistory),
  ];
};

export const useDevToolsCache = (
  cache: Cache
): [SWRCacheData[], SWRCacheData[]] => {
  const [cacheData, setCacheData] = useState<[SWRCacheData[], SWRCacheData[]]>([
    [],
    [],
  ]);

  useEffect(() => {
    const subscribe = createDevToolsCache(cache);
    const unsubscribe = subscribe((key: string, value: any) => {
      console.log("subscribe", { key, value });
      // FIXME should detect the cache is SWR v1 rather than detecting v2
      if (
        value === undefined ||
        ("isValidating" in value && "isLoading" in value)
      ) {
        setCacheData(retrieveCache(key, value));
      } else if (/^\$swr\$/.test(key)) {
        const key2 = key.replace(/^\$swr\$/, "");
        setCacheData(
          retrieveCache(key2, {
            data: cache.get(key2),
            error: value.error,
          })
        );
      } else {
        setCacheData(retrieveCache(key, { data: value }));
      }
    });
    return () => {
      unsubscribe();
      cacheHistory.clear();
      currentCacheData.clear();
    };
  }, [cache]);
  return cacheData;
};
