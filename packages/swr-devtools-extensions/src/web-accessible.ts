const middleware: any =
  (useSWRNext: any) =>
  (...args: any[]) => {
    const result = useSWRNext(...args);
    console.log("Inpected!!!!", result);
    return result;
  };
// @ts-expect-error
window.__SWR_DEVTOOLS_USE__ = [middleware];
