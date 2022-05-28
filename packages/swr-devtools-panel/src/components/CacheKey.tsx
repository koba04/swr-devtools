import React from "react";
import styled from "styled-components";

import {
  isInfiniteCache,
  getInfiniteCacheKey,
  DevToolsCacheData,
} from "swr-devtools/lib/swr-cache";
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
  if (isInfiniteCache(devToolsCacheData.key)) {
    return (
      <CacheText>
        <InfiniteLabel />
        {getInfiniteCacheKey(devToolsCacheData.key)}
      </CacheText>
    );
  }
  return (
    <CacheText>
      {devToolsCacheData.error && <ErrorLabel />}
      {devToolsCacheData.isLoading && <LoadingLabel />}
      {devToolsCacheData.isValidating && <ValidationgLabel />}
      {devToolsCacheData.key}
    </CacheText>
  );
};

const CacheText = styled.span`
  display: inline-block;
  padding: 0.3rem;
`;
