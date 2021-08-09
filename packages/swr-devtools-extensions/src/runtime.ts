import type { Cache } from "swr";

// @ts-expect-error
window.__SWR_DEVTOOLS__ = {
  launch(cache: Cache) {
    cache.subscribe(() => {
      const cacheData = cache.keys().reduce(
        (acc, key) => ({
          ...acc,
          [key]: cache.get(key),
        }),
        {}
      );
      // console.log(data);
      window.postMessage({ cacheData }, "*");
    });
  },
};
