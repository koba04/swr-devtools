import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { useEffect } from "react";

export default function Home() {
  const { data, mutate } = useSWR("/api/hello");
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
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to SWR!</h1>
        <section className={styles.swr}>
          <p>
            /api/hello: {data ? data.name : "...loading"}&nbsp;(auto increment
            in 5 seconds)
          </p>
          <p>/api/hello?foo: {data2 ? data2.name : "...loading"}</p>
        </section>
        <section>
          <Link href="/infinite">/infinite</Link>
        </section>
      </main>
      <footer>
        <p>SWR DevTools</p>
      </footer>
    </div>
  );
}
