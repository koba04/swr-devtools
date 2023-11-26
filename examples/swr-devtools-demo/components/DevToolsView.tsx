import { useContext } from "react";
import { useSWRConfig } from "swr";
import { SWRDevToolsContext } from "swr-devtools";
import { SWRDevToolPanel } from "swr-devtools-panel";

// The way to use SWR DevTools as a React Component
export const DevToolsView = () => {
  const { cache } = useSWRConfig();
  const { events } = useContext(SWRDevToolsContext);
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
      }}
    >
      <SWRDevToolPanel cache={cache} events={events} />
    </div>
  );
};
