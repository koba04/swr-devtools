import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from "swr";
import { useEffect } from 'react';

export default function Home() {
  const { data, mutate } = useSWR("/api/hello");
  const { data: data2 } = useSWR("/api/hello?foo");

  useEffect(() => {
    const timerId = setInterval(() => {
      mutate();
    }, 5000)
    return () => clearInterval(timerId)
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <h2>SWR</h2>
        <div>{data ? data.name : '...loading'}</div>
        <div>{data2 ? data2.name : '...loading'}</div>

      </main>
      <footer>
        <p>SWR DevTools</p>
      </footer>
    </div>
  )
}
