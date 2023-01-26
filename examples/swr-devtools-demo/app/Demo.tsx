"use client";

import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { useEffect } from "react";
import { DevToolsView } from "../components/DevToolsView";
import { SWRDevTools } from "swr-devtools";

let counter = 1;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

const fetcher = async (url) => {
  await sleep(Math.random() * 2000);

  ++counter;
  if (/error/.test(url)) {
    await sleep(1000);
    throw new Error("this is an error message");
  } else if (url.startsWith("/api/hello")) {
    return { name: `Hello World ${counter}` };
  }
};

const App = () => {
  useSWR("/api/hello?error=true", fetcher, {
    shouldRetryOnError: false,
  });
  const { data, mutate, error } = useSWR(
    `/api/hello${typeof window !== "undefined" ? location.search : ""}`,
    fetcher
  );

  useEffect(() => {
    const timerId = setInterval(() => {
      mutate();
    }, 5 * 1000);
    return () => clearInterval(timerId);
  }, [mutate]);

  return (
    <section className={styles.section}>
      <h2 className={styles.subTitle}>Online Demo</h2>
      <p>You can try SWRDevTools on this page!</p>
      <div className={styles.demo}>
        <h3>App</h3>
        <div className={styles.demoApp}>
          <p className={styles.row}>
            <span className={styles.cacheKey}>/api/hello</span>
            {!data && !error && <span>...loading</span>}
            {data && <span>{data.name}</span>}
            {error && <span>Error: {error.message}</span>}
            <span className={styles.note}>(auto increment in 5 seconds)</span>
          </p>
        </div>
        <DevToolsView />
      </div>
    </section>
  );
};

export const Demo = () => (
  <SWRDevTools>
    <App />
  </SWRDevTools>
);
