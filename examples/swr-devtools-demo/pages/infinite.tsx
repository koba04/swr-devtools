import Head from "next/head";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";

export default function Home() {
  const { data, setSize } = useSWRInfinite(
    (index) => `/api/list?page=${index + 1}`
  );

  const pages = data ? data.reduce((acc, page) => acc.concat(page), []) : [];

  return (
    <div>
      <Head>
        <title>useSWRInfinite demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>useSWRInfinite demo</h1>
        <section>
          <ul>
            {pages.map((page) => (
              <li key={page.name}>
                <a href={page.url} target="_blank" rel="noreferrer">
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
          <div>
            <button onClick={() => setSize((size) => size + 1)}>
              load more...
            </button>
          </div>
        </section>
        <section>
          <Link href="/">/index</Link>
        </section>
      </main>
      <footer>
        <p>SWR DevTools</p>
      </footer>
    </div>
  );
}
