import React, { useState } from "react";
import { SWRConfig } from "swr";
import { EventEmitter, createSWRDevtools } from "./createSWRDevTools";

export type SWRDevToolsContextValue = { events: EventEmitter | null };

export const SWRDevToolsContext = React.createContext<SWRDevToolsContextValue>({
  events: null,
});

export const SWRDevTools = ({ children }: { children: React.ReactNode }) => {
  const [swrdevtools, events] = useState(() => createSWRDevtools())[0];
  return (
    <SWRDevToolsContext.Provider value={{ events }}>
      <SWRConfig value={{ use: [swrdevtools] }}>{children}</SWRConfig>
    </SWRDevToolsContext.Provider>
  );
};
