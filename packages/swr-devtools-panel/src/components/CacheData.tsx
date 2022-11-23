import React from "react";
import { JSONTree } from "react-json-tree";
import styled from "styled-components";
import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";
import { CacheKey } from "./CacheKey";
import { ErrorLabel } from "./StatusLabel";
import { useTheme } from "./ThemeProvider";

type Props = {
  cacheData: DevToolsCacheData;
};

export const CacheData = React.memo(({ cacheData }: Props) => (
  <Wrapper>
    <Title>
      <CacheKey cacheData={cacheData} />
      &nbsp;
      <TimestampText>{cacheData.timestampString}</TimestampText>
    </Title>
    <DataWrapper>
      <>
        {cacheData.data && (
          <>
            <DataTitle>Data</DataTitle>
            <CacheDataView data={cacheData.data as any} />
          </>
        )}
        {cacheData.error && (
          <>
            <DataTitle>
              <ErrorLabel>Error</ErrorLabel>
            </DataTitle>
            <CacheDataView data={cacheData.error as any} />
          </>
        )}
      </>
    </DataWrapper>
  </Wrapper>
));
CacheData.displayName = "CacheData";

const CacheDataView = ({ data }: { data: any }) => {
  const theme = useTheme();

  if (typeof window === "undefined") return null;

  return (
    <JSONTree
      data={data}
      theme="railscasts"
      invertTheme={theme !== "dark"}
      hideRoot
      shouldExpandNode={(_keyPath, _data, level) => level < 3}
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
