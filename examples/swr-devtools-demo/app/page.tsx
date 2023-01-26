import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { Demo } from "./Demo";

import cachePanelImage from "../public/img/cache-view.png";
import historyPanelImage from "../public/img/history-view.png";
import networkPanelImage from "../public/img/network-view.png";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>SWR DevTools</h1>
          <p className={styles.lead}>
            A developer tool for{" "}
            <a
              href="https://swr.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              SWR
            </a>
            &nbsp;to help you debug SWR Cache.
          </p>
        </header>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>Download</h2>
          <p className={styles.paragraph}>
            You can download the SWRDevTools extension at the following.
          </p>
          <ul className={styles.list}>
            <li>
              <a
                href="https://chrome.google.com/webstore/detail/swr-devtools/liidbicegefhheghhjbomajjaehnjned"
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                Chrome
              </a>
            </li>
            <li>
              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/swr-devtools/"
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                Firefox
              </a>
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>How to Use</h2>
          <p>
            You don&apos;t need any setup if you use SWR v2, just open
            SWRDevTools extension on your application!
          </p>
          <p>
            ⚠️ If you use SWR v1, Install <code>swr-devtools</code> and wrap
            your application with the <code>SWRDevTools</code> component. Please
            see the more details in{" "}
            <a
              href="https://github.com/koba04/swr-devtools/#how-to-use"
              target="_blank"
              rel="noreferrer"
            >
              the documentation
            </a>
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>Features</h2>
          <p>
            Open the Developer Tools of browsers and select the SWR Panel, you
            can see the following panels.
          </p>
          <h3>Cache Panel</h3>
          <p>The Cache panel shows SWR Cache data on the page.</p>
          <Image
            src={cachePanelImage}
            style={{
              width: "50%",
              minWidth: "300px",
              height: "auto",
            }}
            priority
            alt="A screenshot of cache panel"
          />
          <h3>History Panel</h3>
          <p>The History panel shows logs of fetcher results.</p>
          <Image
            src={historyPanelImage}
            style={{
              width: "50%",
              minWidth: "300px",
              height: "auto",
            }}
            priority
            alt="A screenshot of history panel"
          />
          <h3>Network Panel (Experimental)</h3>
          <p>The Network panel shows a waterfall chart of fetcher results.</p>
          <Image
            src={networkPanelImage}
            style={{
              width: "50%",
              minWidth: "300px",
              height: "auto",
            }}
            priority
            alt="A screenshot of network panel"
          />
        </section>
        <section className={styles.section}>
          <Demo />
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
            className={styles.link}
          >
            koba04/swr-devtools
          </a>
        </p>
      </footer>
    </div>
  );
}
