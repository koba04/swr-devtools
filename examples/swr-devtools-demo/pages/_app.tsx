import "../styles/globals.css";
import { SWRDevTools } from "swr-devtools";

function MyApp({ Component, pageProps }) {
  return (
    <SWRDevTools>
      <Component {...pageProps} />
    </SWRDevTools>
  );
}

export default MyApp;
