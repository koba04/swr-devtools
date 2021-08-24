import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import { mutate } from "swr";
import { SWRCacheData } from "../swr-cache";
import { CacheKey } from "./CacheKey";

type Props = {
  data: SWRCacheData;
};

export const CacheData = React.memo(({ data }: Props) => (
  <>
    <Title>
      <CacheTitle cacheKey={data.key} />
      <MutateButton
        onClick={() => {
          mutate(data.key);
        }}
      >
        mutate
      </MutateButton>
    </Title>
    <DataWrapper>
      <CacheDataView data={data.data} />
      {data.error && <ErrorText>{data.error}</ErrorText>}
    </DataWrapper>
  </>
));
CacheData.displayName = "CacheData";

const DataWrapper = styled.div`
  border-bottom: solid 1px var(--swr-devtools-border-color);
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
  return (
    <ReactJson
      src={data}
      theme={
        matchMedia("(prefers-color-scheme: dark)").matches
          ? "monokai"
          : "rjv-default"
      }
    />
  );
};

const CacheTitle = styled(CacheKey)`
  flex-grow: 1;
`;

const MutateButton = styled.button`
  font-size: 1rem;
  border: none;
  padding: 0.3rem;
  background-color: var(--swr-devtools-mutate-btn-color);
  border-radius: 5px;
  color: var(--swr-devtools-mutate-btn-text-color);

  &:hover {
    background-color: var(--swr-devtools-mutate-btn-hover-color);
  }
`;

const ErrorText = styled.p`
  color: var(--swr-devtools-error-text-colora);
`;

const Title = styled.h3`
  display: flex;
  margin: 0;
  padding: 1rem 0.5rem;
  color: var(--swr-devtools-text-color);
`;
