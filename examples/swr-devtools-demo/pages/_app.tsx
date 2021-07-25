import "../styles/globals.css";
import { SWRDevTools } from "swr-devtools";
import { cache } from "swr";

if (typeof window !== "undefined") {
  console.log("load __SWR_DEVTOOLS__", window);
  // @ts-ignore
  globalThis.__SWR_DEVTOOLS__?.launch(cache);
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SWRDevTools cache={cache} isFixedPosition />
    </>
  );
}

export default MyApp;
