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

export type DevToolsSWRCache<Value = any> = {
  get(key: string): Value;
  set(key: string, value: Value): void;
  subscribe(fn: (key: string, value: Value) => void): () => void;
};

export const spySWRCache = (
  cache: CacheInterface,
  watcher: (key: string, value: any) => void
): void => {
  // intercept operations modifying the cache store
  const originalSet = cache.set;
  cache.set = (key: string, value: any) => {
    watcher(key, value);
    console.log("call map.set", key, value);
    return originalSet.call(cache, key, value);
  };
};

export const createDevToolsSWRCache = (
  cache: CacheInterface
): DevToolsSWRCache => {
  let listeners: Array<(key: string, value: any) => void> = [];
  const store: DevToolsSWRCache = {
    get(key) {
      return cache.get(key);
    },
    set(key, value) {
      cache.set(key, value);
    },
    subscribe(callback) {
      listeners.push(callback);
      return () => {
        listeners = [];
      };
    },
  };
  spySWRCache(cache, (key: string, value: any) => {
    if (isMetaCache(key)) {
      return;
    }
    listeners.forEach((listener) => {
      listener(key, value);
    });
  });
  return store;
};

export const isMetaCache = (key: string) => {
  return (
    // ctx and len are keys used in use-swr-infinite
    /^(?:validating|err|ctx|len)@/.test(key) ||
    // v1 (beta)
    /^\$(?:req|err|ctx|len)\$/.test(key)
  );
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

export const useSWRCache = (
  cache: DevToolsSWRCache
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
