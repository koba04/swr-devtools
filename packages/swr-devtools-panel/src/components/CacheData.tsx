import React from "react";
import { JSONTree } from "react-json-tree";
import styled from "styled-components";
import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";
import { CacheKey } from "./CacheKey";
import { ErrorLabel } from "./StatusLabel";

type Props = {
  devToolsCacheData: DevToolsCacheData;
};

export const CacheData = React.memo(({ devToolsCacheData }: Props) => (
  <Wrapper>
    <Title>
      <CacheKey devToolsCacheData={devToolsCacheData} />
      &nbsp;
      <TimestampText>{devToolsCacheData.timestampString}</TimestampText>
    </Title>
    <DataWrapper>
      <>
        {devToolsCacheData.data && (
          <>
            <DataTitle>Data</DataTitle>
            <CacheDataView data={devToolsCacheData.data as any} />
          </>
        )}
        {devToolsCacheData.error && (
          <>
            <DataTitle>
              <ErrorLabel>Error</ErrorLabel>
            </DataTitle>
            <CacheDataView data={devToolsCacheData.error as any} />
          </>
        )}
      </>
    </DataWrapper>
  </Wrapper>
));
CacheData.displayName = "CacheData";

const CacheDataView = ({ data }: { data: any }) => {
  if (typeof window === "undefined") return null;
  return (
    <JSONTree
      data={data}
      theme="railscasts"
      invertTheme={!matchMedia("(prefers-color-scheme: dark)").matches}
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
