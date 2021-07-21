import "../styles/globals.css";
import { SWRDevTools } from "swr-devtools";
import { cache } from "swr";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SWRDevTools cache={cache} isFixedPosition />
    </>
  );
}

export default MyApp;
