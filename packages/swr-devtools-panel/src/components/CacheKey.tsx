import React from "react";
import styled from "styled-components";

import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";
import {
  ErrorLabel,
  InfiniteLabel,
  LoadingLabel,
  ValidationgLabel,
} from "./StatusLabel";

export const CacheKey = ({
  devToolsCacheData,
}: {
  devToolsCacheData: DevToolsCacheData;
}) => {
  return (
    <CacheText>
      <div>
        {devToolsCacheData.isInfinite
          ? devToolsCacheData.infiniteKey
          : devToolsCacheData.key}
      </div>
      <Labels>
        <>
          {devToolsCacheData.isInfinite && <InfiniteLabel />}
          {devToolsCacheData.error && <ErrorLabel />}
          {devToolsCacheData.isLoading && <LoadingLabel />}
          {devToolsCacheData.isValidating && <ValidationgLabel />}
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
