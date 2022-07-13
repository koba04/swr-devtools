import React from "react";
import styled from "styled-components";

import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";
import {
  ErrorLabel,
  InfiniteLabel,
  LoadingLabel,
  ValidationgLabel,
} from "./StatusLabel";

export const CacheKey = ({ cacheData }: { cacheData: DevToolsCacheData }) => {
  return (
    <CacheText>
      <div>{cacheData.isInfinite ? cacheData.infiniteKey : cacheData.key}</div>
      <Labels>
        <>
          {cacheData.isInfinite && <InfiniteLabel />}
          {cacheData.error && <ErrorLabel />}
          {cacheData.isLoading && <LoadingLabel />}
          {cacheData.isValidating && <ValidationgLabel />}
        </>
      </Labels>
    </CacheText>
  );
};

const CacheText = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-right: auto;
  flex: 1;
  padding-left: 8px;
  min-height: 2em;
`;

const Labels = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-left: 8px;
  margin-right: 4px;
`;
