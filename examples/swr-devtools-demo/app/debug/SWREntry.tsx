import useSWR from "swr";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

const randomNumber = (len: number) => Math.floor(Math.random() * 10 ** len);

const fetcher = async () => {
  await sleep(Math.random() * 2000);
  return randomNumber(3);
};

export const SWREntry = ({
  swrKey,
  options,
}: {
  swrKey: string;
  options: any;
}) => {
  const { data, isLoading, isValidating } = useSWR(
    `/api/debug?key=${swrKey}`,
    fetcher,
    options,
  );
  if (isLoading) return <p>Loading...</p>;
  if (isValidating) return <p>Validating...</p>;
  return <p>{data}</p>;
};
