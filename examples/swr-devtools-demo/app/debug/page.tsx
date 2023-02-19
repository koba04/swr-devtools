"use client";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState } from "react";
import { SWRConfiguration } from "swr";

import styles from "../../styles/infinite.module.css";
import { SWREntry } from "./SWREntry";

type Settings = {
  gridCount: number;
};

type Options = SWRConfiguration & {
  refreshInterval: number;
};

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    gridCount: 10,
  });
  const [options, setOptions] = useState<Options>({
    refreshInterval: 0,
  });
  const onChangeSettings = useCallback((setting: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...setting }));
  }, []);
  const onChangeOptions = useCallback((option: Partial<Options>) => {
    setOptions((current) => ({ ...current, ...option }));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Debug</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Debug</h1>
        <section>
          <h2>Settings</h2>
          <label>
            Grid Count:&nbsp;
            <input
              type="text"
              value={settings.gridCount}
              onChange={(e) => {
                onChangeSettings({ gridCount: +e.target.value });
              }}
            />
          </label>
        </section>
        <section>
          <h2>SWR Options</h2>
          <label>
            refreshInterval:&nbsp;
            <input
              type="text"
              value={options.refreshInterval}
              onChange={(e) => {
                onChangeOptions({ refreshInterval: +e.target.value });
              }}
            />
          </label>
          <section />
        </section>
        <section className={styles.content}>
          <h2>Data</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {Array.from({ length: settings.gridCount }).map((_, i) => {
              const key = "test" + i;
              return <SWREntry key={key} swrKey={key} options={options} />;
            })}
          </div>
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
