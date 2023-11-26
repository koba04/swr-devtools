import { Analytics } from "@vercel/analytics/react";
import { SWRDevTools } from "swr-devtools";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SWRDevTools>
      <Component {...pageProps} />
      <Analytics />
    </SWRDevTools>
  );
}

export default MyApp;
