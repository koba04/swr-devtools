import Head from "next/head";
import Link from "next/link";
import { highlight } from "sugar-high";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { useEffect } from "react";
import { DevToolsView } from "../components/DevToolsView";

export default function Home() {
  // const { data, mutate } = useSWR("/api/hello?error=true");
  const { data, mutate, error } = useSWR(
    `/api/hello${typeof window !== "undefined" ? location.search : ""}`
  );
  const { data: data2 } = useSWR("/api/hello?foo");

  useEffect(() => {
    const timerId = setInterval(() => {
      mutate();
    }, 5000);
    return () => clearInterval(timerId);
  }, [mutate]);

  return (
    <div className={styles.container}>
      <Head>
        <title>SWR DevTools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>SWR DevTools</h1>
          <p className={styles.paragraph}>
            A devtools for{" "}
            <a href="https://swr.vercel.app/" target="_blank" rel="noreferrer">
              SWR
            </a>
            &nbsp;to enable you to inspect your SWR cache data.
          </p>
        </header>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>Download</h2>
          <p className={styles.paragraph}>
            You can download SWRDevTools extensions at the following.
          </p>
          <ul className={styles.list}>
            <li>
              <a
                href="https://chrome.google.com/webstore/detail/swr-devtools/liidbicegefhheghhjbomajjaehnjned"
                target="_blank"
                rel="noreferrer"
              >
                Chrome
              </a>
            </li>
            <li>
              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/swr-devtools/"
                target="_blank"
                rel="noreferrer"
              >
                Firefox
              </a>
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>How to use</h2>
          <p>
            First, you can install <code>swr-devtools</code> and wrap your app
            with the <code>SWRDevTools</code> component
          </p>
          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: highlight(`
import { createRoot } from "react-dom/client";
import { SWRDevTools } from "swr-devtools";

createRoot(document.getElementById("app")).render(
  <SWRDevTools>
    <MainApp />
  </SWRDevTools>
);
          `),
              }}
            />
          </pre>
          <p>
            Then, open the SWR Devtools from the browser&apos;s developer tools
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>Online Demo</h2>
          <div className={styles.demo}>
            <h3>App</h3>
            <div className={styles.demoApp}>
              <p className={styles.row}>
                <span className={styles.cacheKey}>/api/hello</span>
                {!data && !error && <span>...loading</span>}
                {data && <span>{data.name}</span>}
                {error && <span>Error: {error.message}</span>}
                <span className={styles.note}>
                  (auto increment in 5 seconds)
                </span>
              </p>
              <p className={styles.row}>
                <span className={styles.cacheKey}>/api/hello?foo</span>
                <span>{data2 ? data2.name : "...loading"}</span>
              </p>
            </div>
            <DevToolsView />
          </div>
        </section>
        <nav className={styles.nav}>
          You can check{" "}
          <Link href="/infinite">an example with useSWRInfinte</Link>.
        </nav>
      </main>
      <footer className={styles.footer}>
        <p>
          SWR DevTools&nbsp;
          <a
            href="https://github.com/koba04/swr-devtools"
            target="_blank"
            rel="noreferrer"
          >
            koba04/swr-devtools
          </a>
        </p>
      </footer>
    </div>
  );
}
