import "../styles/globals.css";
import { SWRDevTools } from "swr-devtools";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }) {
  return (
    <SWRDevTools>
      <Component {...pageProps} />
      <Analytics />
    </SWRDevTools>
  );
}

export default MyApp;
