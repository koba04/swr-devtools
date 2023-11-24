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
    // @ts-expect-error roperty 'children' does not exist on type 'IntrinsicAttributes & { value?: Partial<PublicConfiguration<any, any, BareFetcher<any>>> & Partial<ProviderConfiguration> & { ...; }; }'.
    <SWRConfig value={{ fetcher }}>
      <SWRDevTools>
        <Component {...pageProps} />
      </SWRDevTools>
    </SWRConfig>
  );
}

export default MyApp;
