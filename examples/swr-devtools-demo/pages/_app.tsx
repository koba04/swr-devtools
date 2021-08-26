import "../styles/globals.css";
import { SWRConfig, useSWRConfig } from "swr";
import { SWRDevToolPanel, SWRDevTools } from "swr-devtools";

// The way to use SWR DevTools as a React Component
const DevToolsArea = () => {
  const cache = useSWRConfig().cache;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "400px",
      }}
    >
      <SWRDevToolPanel cache={cache} />
    </div>
  );
};

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then((r) => r.json()),
      }}
    >
      <SWRDevTools>
        <Component {...pageProps} />
        <DevToolsArea />
      </SWRDevTools>
    </SWRConfig>
  );
}

export default MyApp;
