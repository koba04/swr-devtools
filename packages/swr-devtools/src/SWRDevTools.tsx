import React, { useState } from "react";
import { SWRConfig } from "swr";
import { EventEmitter, createSWRDevtools } from "./createSWRDevTools";

export type SWRDevToolsContextValue = { events: EventEmitter | null };

export const SWRDevToolsContext = React.createContext<SWRDevToolsContextValue>({
  events: null,
});

// This is necessary until SWR has the DevTools hook.
// https://github.com/vercel/swr/pull/2016
if (typeof window !== "undefined") {
  // @ts-expect-error
  window.__SWR_DEVTOOLS_REACT__ = React;
}

export const SWRDevTools = ({ children }: { children: React.ReactNode }) => {
  const [swrdevtools, events] = useState(() => createSWRDevtools())[0];
  return (
    <SWRDevToolsContext.Provider value={{ events }}>
      <SWRConfig value={{ use: [swrdevtools] }}>{children}</SWRConfig>
    </SWRDevToolsContext.Provider>
  );
};
