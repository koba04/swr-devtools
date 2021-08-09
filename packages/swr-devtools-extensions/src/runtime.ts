import type { Cache } from "swr";

const proccessedCacheData = new Set<Cache>();

// @ts-expect-error
window.__SWR_DEVTOOLS__ = {
  launch(cache: Cache) {
    cache.subscribe(() => {
      const cacheData = cache
        .keys()
        .map((key) => [key, cache.get(key)])
        .filter(([_, value]) => !proccessedCacheData.has(value))
        .map(([key, value]) => {
          proccessedCacheData.add(value);
          return { [key]: value };
        })
        .reduce(
          (acc, data) => ({
            ...acc,
            ...data,
          }),
          {}
        );
      // console.log(data);
      window.postMessage({ cacheData }, "*");
    });
  },
};
