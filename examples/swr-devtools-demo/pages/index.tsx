import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { DevToolsView } from "../components/DevToolsView";

export default function Home() {
  useSWR("/api/hello?error=true");
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
            &nbsp;to enable you to inspect your SWR.
          </p>
        </header>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>Download</h2>
          <p className={styles.paragraph}>
            You can download SWRDevTools at the following.
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
          <h2 className={styles.subTitle}>Setup</h2>
          <ol className={styles.list}>
            <li>Install SWRDevTools in the above links</li>
            <li>
              <b>
                [<code>swr@1.x</code> only]
              </b>{" "}
              install <code>swr-devtools</code> and wrap your application with
              the <code>SWRDevTools</code> component. Please see the more
              details in{" "}
              <a
                href="https://github.com/koba04/swr-devtools/#how-to-use"
                target="_blank"
                rel="noreferrer"
              >
                the documentation
              </a>
            </li>
          </ol>
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
