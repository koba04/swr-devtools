import React from "react";
import { JSONTree } from "react-json-tree";
import styled from "styled-components";
import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";
import { CacheKey } from "./CacheKey";
import { ErrorLabel } from "./StatusLabel";

type Props = {
  cacheData: DevToolsCacheData;
  modeType: string;
};

export const CacheData = React.memo(({ cacheData, modeType }: Props) => (
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
            <CacheDataView data={cacheData.data as any} modeType={modeType} />
          </>
        )}
        {cacheData.error && (
          <>
            <DataTitle>
              <ErrorLabel>Error</ErrorLabel>
            </DataTitle>
            <CacheDataView data={cacheData.error as any} modeType={modeType} />
          </>
        )}
      </>
    </DataWrapper>
  </Wrapper>
));
CacheData.displayName = "CacheData";

const CacheDataView = ({ data, modeType }: { data: any, modeType: string }) => {
  if (typeof window === "undefined") return null;

  return (
    <JSONTree
      data={data}
      theme="railscasts"
      invertTheme={!(modeType === 'Dark' || modeType === 'System' && matchMedia("(prefers-color-scheme: dark)").matches)}
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
