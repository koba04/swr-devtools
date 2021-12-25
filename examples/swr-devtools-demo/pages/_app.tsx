import "../styles/globals.css";
import { SWRConfig, useSWRConfig } from "swr";
import { SWRDevTools } from "swr-devtools";
import { SWRDevToolPanel } from "swr-devtools-panel";

// The way to use SWR DevTools as a React Component
const DevToolsArea = () => {
  const { cache } = useSWRConfig();
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

const fetcher = async (url) => {
  const res = await fetch(url);
  const json = await res.json();
  if (res.ok) {
    return json;
  }
  throw new Error(json.message);
};

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <SWRDevTools>
        <Component {...pageProps} />
        <DevToolsArea />
      </SWRDevTools>
    </SWRConfig>
  );
}

export default MyApp;
