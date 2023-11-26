import { useState, useEffect } from "react";
import { Cache } from "swr";

import {
  injectSWRCache,
  DevToolsCacheData,
  convertToDevToolsCacheData,
} from "swr-devtools/lib/swr-cache";
import { formatDateTime } from "./format";

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

const cacheDataMap = new Map<string, DevToolsCacheData>();

const sortCacheDataFromLatest = (cacheData: Map<string, DevToolsCacheData>) => {
  return Array.from(cacheData.values())
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .reverse();
};

const retrieveCache = (
  key: string,
  value: Partial<DevToolsCacheData>,
): DevToolsCacheData[] => {
  const date = new Date();

  const cacheData = cacheDataMap.get(key);

  const updatedCacheData: DevToolsCacheData = Object.keys(
    value,
  ).reduce<DevToolsCacheData>(
    (acc, cacheKey) => ({
      ...acc,
      [cacheKey]: value[cacheKey as keyof DevToolsCacheData],
    }),
    {} as DevToolsCacheData,
  );

  cacheDataMap.set(key, {
    ...cacheData,
    ...updatedCacheData,
    key,
    timestamp: date,
    timestampString: formatDateTime(date),
  });

  return sortCacheDataFromLatest(cacheDataMap);
};

export const useDevToolsCache = (cache: Cache | null): DevToolsCacheData[] => {
  const [cacheData, setCacheData] = useState<DevToolsCacheData[]>([]);

  useEffect(() => {
    if (cache === null) return;
    const subscribe = createDevToolsCache(cache);
    const unsubscribe = subscribe(
      (key_: string, value_: Partial<DevToolsCacheData>) => {
        const { key, value } = convertToDevToolsCacheData(key_, value_);
        setCacheData(retrieveCache(key, value));
      },
    );
    return () => {
      unsubscribe();
      cacheDataMap.clear();
    };
  }, [cache]);

  return cacheData;
};
