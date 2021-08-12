import "../styles/globals.css";
import { SWRDevTools } from "swr-devtools";
import { cache } from "swr";
import { createDevToolsSWRCache } from "swr-devtools/lib/cache";

// The way to use SWR DevTools as a Chrome extension
if (typeof window !== "undefined") {
  // @ts-ignore
  globalThis.__SWR_DEVTOOLS__?.launch(cache);
}

// The way to use SWR DevTools as a React Component
const devtoolsSWRCache = createDevToolsSWRCache(cache);
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
