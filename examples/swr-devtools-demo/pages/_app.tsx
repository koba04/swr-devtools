import "../styles/globals.css";
import { /* SWRDevToolPanel, */ SWRDevTools } from "swr-devtools";

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
    {/* <SWRDevToolPanel cache={cache} /> */}
  </div>
);

function MyApp({ Component, pageProps }) {
  return (
    <SWRDevTools>
      <Component {...pageProps} />
      <DevToolsArea />
    </SWRDevTools>
  );
}

export default MyApp;
