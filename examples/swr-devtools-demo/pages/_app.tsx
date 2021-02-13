import "../styles/globals.css";
import { SWRDevTools } from "swr-devtools";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SWRDevTools />
    </>
  );
}

export default MyApp;
