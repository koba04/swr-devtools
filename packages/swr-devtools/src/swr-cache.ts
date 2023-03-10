import type { Cache } from "swr";
import superjson from "superjson";

export type DevToolsCacheData = {
  key: string;
  data?: unknown;
  isValidating?: boolean;
  isLoading?: boolean;
  error?: unknown;
  timestamp: Date;
  timestampString: string;
  isInfinite?: boolean;
  infiniteKey?: string;
  isSubscription: boolean;
  subscriptionKey: string;
};

export const serializePayload = (payload: any) => superjson.stringify(payload);
export const deserializePayload = (payload: any) =>
  // this check is required to support the case using the SWRDevTools component directly
  // In this case, the payload is not serialized
  typeof payload === "string" ? superjson.parse(payload) : payload;

export const injectSWRCache = (
  cache: Cache,
  watcher: (key: string, value: any) => void
): void => {
  // intercept operations modifying the cache store
  const originalSet = cache.set;
  cache.set = (key: string, value: any) => {
    if (!isMetaCache(key)) {
      watcher(key, value);
    }
    return originalSet.call(cache, key, value);
  };
  const originalDelete = cache.delete;
  cache.delete = (key: string) => {
    if (!isMetaCache(key)) {
      watcher(key, undefined);
    }
    return originalDelete.call(cache, key);
  };
};

const isMetaCache = (key: string) => {
  return /^\$(?:ctx|len)\$/.test(key);
};

const isErrorCache = (key: string) => {
  return /^\$err\$/.test(key);
};

const isInfiniteCache = (key: string) => {
  return /\$inf\$/.test(key);
};

const isSubscriptionCache = (key: string) => {
  return /\$sub\$/.test(key);
};

const isIsValidatingCache = (key: string) => {
  return /^\$req\$/.test(key);
};

const filterMetaCacheKey = (key: string) => {
  const match = key.match(
    /^(?:\$(?:req|swr|err)\$)?(?:\$(inf|sub)\$)(?<cacheKey>.*)?/
  );
  return match?.groups?.cacheKey ?? key;
};

const isV2CacheData = (data: any) => {
  return (
    ("isValidating" in data && "isLoading" in data) ||
    // useSWRSubscription
    ("_c" in data && "_k" in data)
  );
};

const isV1MetaCache = (key: string) => {
  return /^\$swr\$/.test(key);
};

// refs. https://github.com/koba04/swr-devtools/issues/48
export const convertToDevToolsCacheData = (
  key: string,
  value: any
): { key: string; value: Partial<DevToolsCacheData> } => {
  const isInfinite = isInfiniteCache(key);
  const isSubscription = isSubscriptionCache(key);
  const infiniteKey = isInfinite ? filterMetaCacheKey(key) : undefined;
  const subscriptionKey = isSubscription ? filterMetaCacheKey(key) : undefined;

  if (
    value !== undefined &&
    typeof value === "object" &&
    isV2CacheData(value)
  ) {
    // SWR v2
    // useSWRSubscription was added at 2.1.0
    return {
      key,
      value: {
        ...value,
        isInfinite,
        infiniteKey,
        subscriptionKey,
        isSubscription,
      },
    };
  } else if (value !== undefined && isV1MetaCache(key)) {
    // SWR ^1.3.0 ($swr$ cache key)
    return {
      key: key.replace("$swr$", ""),
      value: { ...value, isInfinite, infiniteKey },
    };
  } else if (isErrorCache(key)) {
    // SWR <1.3.0
    return {
      key: key.replace("$err$", ""),
      value: {
        error: value,
        isInfinite,
        infiniteKey,
      },
    };
  } else if (isIsValidatingCache(key)) {
    // SWR <1.3.0
    return {
      key: key.replace("$req$", ""),
      value: {
        isValidating: value,
        isInfinite,
        infiniteKey,
      },
    };
  }
  return {
    key,
    value: { data: value, isInfinite },
  };
};
