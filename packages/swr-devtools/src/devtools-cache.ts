import { useState, useEffect } from "react";
import type { CacheInterface } from "swr";

import { injectSWRCache, isMetaCache, SWRCacheData } from "./swr-cache";

export type DevToolsCache<Value = any> = {
  get(key: string): Value;
  set(key: string, value: Value): void;
  delete(key: string): void;
  // TODO: should support a delete method
  subscribe(fn: (key: string, value: Value) => void): () => void;
};

export const createDevToolsCache = (cache: CacheInterface): DevToolsCache => {
  let listeners: Array<(key: string, value: any) => void> = [];
  const store: DevToolsCache = {
    get(key) {
      return cache.get(key);
    },
    set(key, value) {
      cache.set(key, value);
    },
    delete(key) {
      cache.delete(key);
    },
    subscribe(callback) {
      listeners.push(callback);
      return () => {
        listeners = [];
      };
    },
  };
  injectSWRCache(cache, (key: string, value: any) => {
    if (isMetaCache(key)) {
      return;
    }
    listeners.forEach((listener) => {
      listener(key, value);
    });
  });
  return store;
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

const retrieveCache = (
  key: string,
  value: any
): [SWRCacheData[], SWRCacheData[]] => {
  const date = new Date();

  currentCacheData.set(key, {
    key,
    data: value,
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
  cache: DevToolsCache
): [SWRCacheData[], SWRCacheData[]] => {
  const [cacheData, setCacheData] = useState<[SWRCacheData[], SWRCacheData[]]>([
    [],
    [],
  ]);

  useEffect(() => {
    const unsubscribe = cache.subscribe((key: string, value: any) => {
      setCacheData(retrieveCache(key, value));
    });
    return () => unsubscribe();
  }, [cache]);
  return cacheData;
};
