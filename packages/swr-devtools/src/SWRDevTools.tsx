import React, { useEffect, useLayoutEffect } from "react";
import { SWRConfig, Middleware, unstable_serialize } from "swr";

const injected = new WeakSet<any>();

export type DevToolsMessage =
  | {
      type: "updated_swr_cache";
      payload: {
        key: string;
        value: any;
      };
    }
  | {
      type: "initialized";
    };

const swrdevtools: Middleware = (useSWRNext) => (key, fn, config) => {
  useLayoutEffect(() => {
    window.postMessage({ type: "initialized" }, "*");
  }, []);

  const res = useSWRNext(key, fn, config);
  // This doesn't work with useSWRInfinite because we cannot get the current page index that useSWRInfinite gets as an argument.
  // This should be `(index) => key(index)` with useSWRInfinite
  const serializedKey = unstable_serialize(key);

  useEffect(() => {
    if (typeof res.data !== "undefined" && !injected.has(res.data)) {
      window.postMessage(
        {
          type: "updated_swr_cache",
          payload: {
            key: serializedKey,
            value: res.data,
          },
        },
        "*"
      );
      injected.add(res.data);
    }
  });

  return res;
};

export const SWRDevTools = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={{ use: [swrdevtools] }}>{children}</SWRConfig>;
};
