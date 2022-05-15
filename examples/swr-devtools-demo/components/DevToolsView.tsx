import { useSWRConfig } from "swr";
import { SWRDevToolPanel } from "swr-devtools-panel";

// The way to use SWR DevTools as a React Component
export const DevToolsView = () => {
  const { cache } = useSWRConfig();
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
      }}
    >
      <SWRDevToolPanel cache={cache} />
    </div>
  );
};
