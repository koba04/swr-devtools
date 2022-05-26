import React, { lazy, Suspense } from "react";
import { ReactJsonViewProps } from "react-json-view";
import styled from "styled-components";
import { SWRCacheData } from "swr-devtools/lib/swr-cache";
import { CacheKey } from "./CacheKey";
import { ErrorLabel } from "./ErrorLabel";

type Props = {
  cache: SWRCacheData;
};

export const CacheData = React.memo(
  ({
    cache: {
      // @ts-ignore
      cache: { data, error },
      key,
      timestampString,
    },
  }: Props) => (
    <Wrapper>
      <Title>
        {error && <ErrorLabel />}
        <CacheKey cacheKey={key} />
        &nbsp;
        <TimestampText>{timestampString}</TimestampText>
      </Title>
      <DataWrapper>
        {data && <CacheDataView data={data} />}
        {error && <ErrorData error={error} />}
      </DataWrapper>
    </Wrapper>
  )
);
CacheData.displayName = "CacheData";

const ErrorData = ({ error }: { error: string | ReactJsonViewProps }) => (
  <ErrorWrapper>
    <ErrorTitle>ERROR</ErrorTitle>
    {typeof error === "string" ? (
      <ErrorText>{error}</ErrorText>
    ) : (
      <CacheDataView data={error} />
    )}
  </ErrorWrapper>
);

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

const ErrorWrapper = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 0;
`;

const ErrorText = styled.p`
  margin: 0;
  color: var(--swr-devtools-text-color);
`;

const ErrorTitle = styled.h4`
  margin: 0;
  padding: 0.3rem 0;
  color: var(--swr-devtools-text-color);
`;

const Title = styled.h3`
  margin: 0;
  padding: 0.5rem 0rem;
  color: var(--swr-devtools-text-color);
`;

const TimestampText = styled.span`
  font-size: 1rem;
  font-weight: normal;
`;
