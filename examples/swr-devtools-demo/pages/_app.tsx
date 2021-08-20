import "../styles/globals.css";
import { SWRDevTools, launch } from "swr-devtools";
import { cache } from "swr";

// The way to use SWR DevTools as a Chrome extension
if (typeof window !== "undefined") {
  launch(cache);
}

// The way to use SWR DevTools as a React Component
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
