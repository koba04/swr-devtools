import "../styles/globals.css";
import { SWRDevTools, createDevToolsCache } from "swr-devtools";
import { cache } from "swr";

// The way to use SWR DevTools as a Chrome extension
if (typeof window !== "undefined") {
  // @ts-ignore
  globalThis.__SWR_DEVTOOLS__?.launch(cache);
}

// The way to use SWR DevTools as a React Component
const devtoolsSWRCache = createDevToolsCache(cache);
const DevToolsArea = () => (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      height: "400px",
    }}
  >
    <SWRDevTools cache={devtoolsSWRCache} />
  </div>
);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <DevToolsArea />
    </>
  );
}

export default MyApp;
