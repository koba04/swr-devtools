"use client";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState } from "react";
import { SWRConfiguration, useSWRConfig } from "swr";

import styles from "./debug.module.css";
import { SWREntry } from "./SWREntry";

type Settings = {
  gridCount: number;
};

type Options = SWRConfiguration & {
  refreshInterval: number;
};

export default function Home() {
  const config = useSWRConfig();
  const [settings, setSettings] = useState<Settings>({
    gridCount: 10,
  });

  const [options, setOptions] = useState<Options>({
    ...config,
    refreshInterval: 0,
  });
  console.log(config);
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

      <main className={styles.main}>
        <h1 className={styles.title}>Debug</h1>
        <fieldset className={styles.section}>
          <legend className={styles.subtitle}>Settings</legend>
          <label className={styles.label}>
            <span>Grid Count</span>
            <input
              type="text"
              value={settings.gridCount}
              onChange={(e) => {
                onChangeSettings({ gridCount: +e.target.value });
              }}
            />
          </label>
        </fieldset>
        <fieldset className={styles.section}>
          <legend className={styles.subtitle}>SWR Options</legend>
          <label className={styles.label}>
            <span>refreshInterval</span>
            <input
              type="text"
              value={options.refreshInterval}
              onChange={(e) => {
                onChangeOptions({ refreshInterval: +e.target.value });
              }}
            />
          </label>
          <label className={styles.label}>
            <span>revalidateIfStale</span>
            <input
              type="checkbox"
              checked={options.revalidateIfStale}
              onChange={(e) => {
                onChangeOptions({ revalidateIfStale: e.target.checked });
              }}
            />
          </label>
          <label className={styles.label}>
            <span>revalidateOnMount</span>
            <input
              type="checkbox"
              checked={options.revalidateOnMount}
              onChange={(e) => {
                onChangeOptions({ revalidateOnMount: e.target.checked });
              }}
            />
          </label>
          <label className={styles.label}>
            <span>revalidateOnFocus</span>
            <input
              type="checkbox"
              checked={options.revalidateOnFocus}
              onChange={(e) => {
                onChangeOptions({ revalidateOnFocus: e.target.checked });
              }}
            />
          </label>
        </fieldset>
        <section className={styles.section}>
          <h2 className={styles.subtitle}>Data</h2>
          <div className={styles.grid}>
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
