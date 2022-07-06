import "../styles/globals.css";
import { SWRConfig } from "swr";
import { SWRDevTools } from "swr-devtools";

const fetcher = async (url) => {
  const res = await fetch(url);
  const json = await res.json();
  if (res.ok) {
    return json;
  }
  throw new Error(json.message);
};

function MyApp({ Component, pageProps }) {
  return (
    // @ts-expect-error
    <SWRConfig value={{ fetcher }}>
      <SWRDevTools>
        <Component {...pageProps} />
      </SWRDevTools>
    </SWRConfig>
  );
}

export default MyApp;
