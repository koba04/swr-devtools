import { useState, useEffect } from "react";
import { Cache } from "swr";

import {
  injectSWRCache,
  DevToolsCacheData,
  convertToDevToolsCacheData,
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

const cacheHistory = new Map<string, DevToolsCacheData>();
const currentCacheData = new Map<string, DevToolsCacheData>();

const getCacheHistoryKey = (key: string, timestamp: Date) =>
  `${key}__${timestamp.getTime()}`;

const sortCacheDataFromLatest = (cacheData: Map<string, DevToolsCacheData>) => {
  return Array.from(cacheData.values())
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .reverse();
};

// TODO: this is a draft implementation
const toJSON = (value: any) => {
  return value instanceof Error ? { message: value.message } : value;
};

const retrieveCache = (
  key: string,
  value: Partial<DevToolsCacheData>
): [DevToolsCacheData[], DevToolsCacheData[]] => {
  const date = new Date();

  const currentDevToolsCacheData = currentCacheData.get(key);

  const devToolsCacheData: DevToolsCacheData = Object.keys(
    value
  ).reduce<DevToolsCacheData>(
    (acc, cacheKey) => ({
      ...acc,
      [cacheKey]: toJSON(value[cacheKey as keyof DevToolsCacheData]),
    }),
    {} as DevToolsCacheData
  );

  currentCacheData.set(key, {
    ...currentDevToolsCacheData,
    ...devToolsCacheData,
    key,
    timestamp: date,
    timestampString: formatTime(date),
  });

  const cacheHistoryKey = getCacheHistoryKey(key, date);
  cacheHistory.set(cacheHistoryKey, currentCacheData.get(key)!);

  return [
    sortCacheDataFromLatest(currentCacheData),
    sortCacheDataFromLatest(cacheHistory),
  ];
};

export const useDevToolsCache = (
  cache: Cache | null
): [DevToolsCacheData[], DevToolsCacheData[]] => {
  const [cacheData, setCacheData] = useState<
    [DevToolsCacheData[], DevToolsCacheData[]]
  >([[], []]);

  useEffect(() => {
    if (cache === null) return;
    const subscribe = createDevToolsCache(cache);
    const unsubscribe = subscribe(
      (key_: string, value_: Partial<DevToolsCacheData>) => {
        const { key, value } = convertToDevToolsCacheData(key_, value_);
        setCacheData(retrieveCache(key, value));
      }
    );
    return () => {
      unsubscribe();
      cacheHistory.clear();
      currentCacheData.clear();
    };
  }, [cache]);

  return cacheData;
};
