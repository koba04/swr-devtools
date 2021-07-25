console.log("assigned __SWR_DEVTOOLS__", window);
window.__SWR_DEVTOOLS__ = {
  launch(cache) {
    console.log("Hello SWR DevTools", cache);
    cache.subscribe(() => {
      const cacheData = {};
      for (const key of cache.keys()) {
        cacheData[key] = cache.get(key);
      }
      // console.log(data);
      window.postMessage({ cacheData });
    });
  },
};
