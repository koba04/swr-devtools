import "../styles/globals.css";
import { SWRConfig } from "swr";
import { SWRDevTools } from "swr-devtools";

const fetcher = async (url) => {
  const res = await fetch(url);
  const json = await res.json();
  if (res.ok) {
    if (/\/api\/hello/.test(url)) {
      return {
        ...json,
        // test for serialize values
        // Symbol is stripped through postMessage
        // Map is serialized
        /*
        symbol: Symbol.for("test"),
        map: new Map([
          ["foo", "foo1"],
          ["bar", "bar1"],
        ]),
        */
      };
    }
    return json;
  }
  throw new Error(json.message);
};

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <SWRDevTools>
        <Component {...pageProps} />
      </SWRDevTools>
    </SWRConfig>
  );
}

export default MyApp;
