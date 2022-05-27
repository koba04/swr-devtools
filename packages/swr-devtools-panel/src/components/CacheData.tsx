import React, { lazy, Suspense } from "react";
import { ReactJsonViewProps } from "react-json-view";
import styled from "styled-components";
import { SWRCacheData } from "swr-devtools/lib/swr-cache";
import { CacheKey } from "./CacheKey";
import { ErrorLabel } from "./StatusLabel";

type Props = {
  cache: SWRCacheData;
};

export const CacheData = React.memo(
  ({
    cache: {
      // @ts-ignore
      cache: cacheData,
      key,
      timestampString,
    },
  }: Props) => (
    <Wrapper>
      <Title>
        <CacheKey cacheKey={key} cache={cacheData} />
        &nbsp;
        <TimestampText>{timestampString}</TimestampText>
      </Title>
      <DataWrapper>
        {cacheData.data && (
          <>
            <DataTitle>Data</DataTitle>
            <CacheDataView data={cacheData.data} />
          </>
        )}
        {cacheData.error && (
          <>
            <DataTitle>
              <ErrorLabel>Error</ErrorLabel>
            </DataTitle>
            <CacheDataView data={cacheData.error} />
          </>
        )}
      </DataWrapper>
    </Wrapper>
  )
);
CacheData.displayName = "CacheData";

const CacheDataView = ({ data }: { data: ReactJsonViewProps }) => {
  if (typeof window === "undefined") return null;
  return (
    <Suspense fallback="loading">
      <AsyncReactJson data={data} />
    </Suspense>
  );
};

const AsyncReactJson = ({ data }: { data: ReactJsonViewProps }) => {
  const ReactJson = lazy(() => import("react-json-view"));
  return (
    <ReactJson
      src={data}
      theme={
        matchMedia("(prefers-color-scheme: dark)").matches
          ? "railscasts"
          : "rjv-default"
      }
    />
  );
};

const Wrapper = styled.div`
  padding: 0.2rem;
`;

const DataWrapper = styled.div`
  font-size: 0.8rem;
  height: 100%;
  margin: 0;
  padding: 0 0.3rem;
`;

const Title = styled.h3`
  margin: 0;
  padding: 0.5rem 0rem;
  color: var(--swr-devtools-text-color);
`;

const DataTitle = styled.h4`
  margin: 0;
  padding: 0.5rem 0rem;
  color: var(--swr-devtools-text-color);
`;

const TimestampText = styled.span`
  font-size: 1rem;
  font-weight: normal;
`;
