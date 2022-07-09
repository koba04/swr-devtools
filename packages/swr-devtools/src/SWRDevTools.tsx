import React, { useRef } from "react";
import { SWRConfig } from "swr";
import { EventEmitter, createSWRDevtools } from "./createSWRDevTools";

export type SWRDevToolsContextValue = { events: EventEmitter | null };

export const SWRDevToolsContext = React.createContext<SWRDevToolsContextValue>({
  events: null,
});

if (typeof window !== "undefined") {
  // @ts-expect-error
  window.__SWR_DEVTOOLS_REACT__ = React;
}

export const SWRDevTools = ({ children }: { children: React.ReactNode }) => {
  const [swrdevtools, events] = useRef(createSWRDevtools()).current;
  return (
    <SWRDevToolsContext.Provider value={{ events }}>
      <SWRConfig value={{ use: [swrdevtools] }}>{children}</SWRConfig>
    </SWRDevToolsContext.Provider>
  );
};
