const middleware: any =
  (useSWRNext: any) =>
  (...args: any[]) => {
    const result = useSWRNext(...args);
    console.log("inspected", { result, args });
    const [key] = args;
    const { data, error, isLoading, isValidating } = result;
    window.postMessage({
      type: "updated_swr_cache",
      payload: {
        key,
        value: {
          data,
          error,
          isLoading,
          isValidating,
        },
      },
    });
    return result;
  };

// @ts-expect-error
window.__SWR_DEVTOOLS_USE__ = [middleware];
