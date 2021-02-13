import { useState, useEffect } from "react";
import { cache } from "swr";

type CacheData = {
  key: string,
  data: any,
  isValidating: boolean,
  error: string,
  timestamp: Date,
  timestampString: string
}

const formatTime = (date: Date) => (
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
);

const retrieveCache = (): CacheData[] => {
  const date = new Date();
  return cache.keys()
    .filter(key => !key.startsWith("validating@") && !key.startsWith("err@"))
    .map(key => {
      const isValidating = cache.get(`validating@${key}`);
      const error = cache.get(`err@${key}`);
      const data = cache.get(key);
      return {
        key,
        data,
        isValidating,
        error,
        timestamp: date,
        timestampString: formatTime(date)
      }
    })
}

export const useSWRCache = (): CacheData[] => {
  const [cacheData, setCacheData] = useState<CacheData[]>([]);
  useEffect(() => {
    const unsubscribe = cache.subscribe(() => {
      setCacheData(retrieveCache())
    })
    return () => unsubscribe();
  }, [cache]);
  return cacheData;
}

