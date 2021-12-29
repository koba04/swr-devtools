import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { useEffect } from "react";

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
        <title>SWR DevTools Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>
          <h1 className={styles.title}>SWR DevTools Demo</h1>
          <a
            href="https://github.com/koba04/swr-devtools"
            target="_blank"
            rel="noreferrer"
          >
            koba04/swr-devtools
          </a>
        </p>
        <section>
          <p className={styles.row}>
            <span className={styles.cacheKey}>/api/hello</span>
            {!data && !error && <span>...loading</span>}
            {data && <span>{data.name}</span>}
            {error && <span>Error: {error.message}</span>}
            <span className={styles.note}>(auto increment in 5 seconds)</span>
          </p>
          <p className={styles.row}>
            <span className={styles.cacheKey}>/api/hello?foo</span>
            <span>{data2 ? data2.name : "...loading"}</span>
          </p>
        </section>
        <nav className={styles.nav}>
          <Link href="/infinite">/infinite</Link>
        </nav>
      </main>
      <footer>
        <p>SWR DevTools</p>
      </footer>
    </div>
  );
}
