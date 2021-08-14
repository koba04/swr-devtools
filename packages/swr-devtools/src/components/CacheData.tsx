import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import type { SWRCacheData } from "../swr-cache";

type Props = {
  data: SWRCacheData;
};

export const CacheData = React.memo(({ data }: Props) => (
  <>
    <Title>
      {data.key}&nbsp;
      <TimestampText>{data.timestampString}</TimestampText>
    </Title>
    <DataWrapper>
      <CacheDataView data={data.data} />
      {data.error && <ErrorText>{data.error}</ErrorText>}
    </DataWrapper>
  </>
));
CacheData.displayName = "CacheData";

const DataWrapper = styled.div`
  border-bottom: solid 1px #ccc;
  font-size: 1rem;
  height: 100%;
  margin: 0;
  padding: 0 0.3rem;
`;

const CacheDataView = ({ data }: Props) => {
  if (typeof window === "undefined") return null;
  return (
    <Suspense fallback="loading">
      <AsyncReactJson data={data} />
    </Suspense>
  );
};

const AsyncReactJson = ({ data }: Props) => {
  const ReactJson = lazy(() => import("react-json-view"));
  return <ReactJson src={data} />;
};

const ErrorText = styled.p`
  color: red;
`;

const Title = styled.h3`
  margin: 0;
  padding: 1rem 0.5rem;
`;

const TimestampText = styled.span`
  font-size: 1rem;
  font-weight: normal;
`;
