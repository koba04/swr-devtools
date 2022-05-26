import { useState, useEffect } from "react";
import { Cache } from "swr";

import {
  injectSWRCache,
  isMetaCache,
  SWRCacheData,
  convertCacheData,
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

  currentCacheData.set(key, {
    key,
    cache: Object.keys(value).reduce(
      (acc, cacheKey) => ({
        ...acc,
        [cacheKey]: toJSON(value[cacheKey]),
      }),
      {}
    ),
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
    const unsubscribe = subscribe((key_: string, value_: any) => {
      const { key, value } = convertCacheData(key_, value_, cache);
      setCacheData(retrieveCache(key, value));
    });
    return () => {
      unsubscribe();
      cacheHistory.clear();
      currentCacheData.clear();
    };
  }, [cache]);
  return cacheData;
};
