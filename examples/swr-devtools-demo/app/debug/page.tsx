"use client";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

import styles from "../../styles/infinite.module.css";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

let count = 0;

const fetcher = async (url) => {
  await sleep(Math.random() * 2000);
  return count++;
};

export default function Home() {
  const { data, isLoading } = useSWR("/api/debug", fetcher);

  return (
    <div className={styles.container}>
      <Head>
        <title>Debug</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Debug</h1>
        <section className={styles.content}>
          <p>{isLoading ? "loading..." : data}</p>
        </section>
        <nav className={styles.nav}>
          <Link href="/">Go back</Link>
        </nav>
      </main>
      <footer>
        <p>SWR DevTools</p>
      </footer>
    </div>
  );
}
