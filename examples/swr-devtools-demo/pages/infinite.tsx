import Head from "next/head";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { DevToolsView } from "../components/DevToolsView";

import styles from "../styles/infinite.module.css";

const dummyData = {
  1: [
    {
      name: "Array.prototype.at()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at",
    },
    {
      name: "Array.prototype.concat()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat",
    },
    {
      name: "Array.prototype.copyWithin()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin",
    },
    {
      name: "Array.prototype.entries()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries",
    },
    {
      name: "Array.prototype.every()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every",
    },
  ],
  2: [
    {
      name: "HTMLElement.accessKey",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/accessKey",
    },
    {
      name: "HTMLElement.contentEditable",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable",
    },
    {
      name: "HTMLElement.inert",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert",
    },
    {
      name: "HTMLElement.nonce",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/nonce",
    },
    {
      name: "HTMLElement.tabIndex",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex",
    },
  ],
  3: [
    {
      name: "animation",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation",
    },
    {
      name: "background",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/background",
    },
    {
      name: "border",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/border",
    },
    {
      name: "display",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/display",
    },
    {
      name: "env()",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/env()",
    },
  ],
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

const fetcher = async (url) => {
  await sleep(Math.random() * 2000);
  const searchParams = new URL(location.origin + url).searchParams;
  const page = searchParams.get("page");
  return page !== null && dummyData[page] ? dummyData[page] : [];
};

export default function Home() {
  const { data, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/list?page=${index + 1}`,
    fetcher,
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
