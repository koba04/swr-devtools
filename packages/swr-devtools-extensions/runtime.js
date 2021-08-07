window.__SWR_DEVTOOLS__ = {
  launch(cache) {
    cache.subscribe(() => {
      const cacheData = cache.keys().reduce(
        (acc, key) => ({
          ...acc,
          [key]: cache.get(key),
        }),
        {}
      );
      // console.log(data);
      window.postMessage({ cacheData });
    });
  },
};
