import Head from "next/head";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { DevToolsView } from "../components/DevToolsView";

import styles from "../styles/infinite.module.css";

export default function Home() {
  const { data, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/list?page=${index + 1}`
  );

  const pages = data ? data.reduce((acc, page) => acc.concat(page), []) : [];

  return (
    <div className={styles.container}>
      <Head>
        <title>useSWRInfinite Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>useSWRInfinite Demo</h1>
        <section className={styles.content}>
          <ul className={styles.list}>
            {pages.map((page) => (
              <li key={page.name} className={styles.listItem}>
                <a href={page.url} target="_blank" rel="noreferrer">
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.buttonArea}>
            <button
              disabled={isValidating}
              className={styles.button}
              onClick={() => setSize((size) => size + 1)}
            >
              {isValidating ? "...loading" : "Load more"}
            </button>
          </div>
        </section>
        <nav className={styles.nav}>
          <Link href="/">Go back</Link>
        </nav>
      </main>
      <footer>
        <p>SWR DevTools</p>
      </footer>
      <DevToolsView />
    </div>
  );
}
