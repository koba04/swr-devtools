import "../styles/globals.css";
import { SWRDevTools } from "swr-devtools";
import { cache } from "swr";

if (typeof window !== "undefined") {
  console.log("load __SWR_DEVTOOLS__", window);
  // @ts-ignore
  globalThis.__SWR_DEVTOOLS__?.launch(cache);
}

const DevToolsArea = () => (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      height: "400px",
    }}
  >
    <SWRDevTools cache={cache} />
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
