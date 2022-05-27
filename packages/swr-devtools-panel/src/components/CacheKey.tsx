import React from "react";
import styled from "styled-components";

import {
  isInfiniteCache,
  getInfiniteCacheKey,
} from "swr-devtools/lib/swr-cache";
import {
  ErrorLabel,
  InfiniteLabel,
  LoadingLabel,
  ValidationgLabel,
} from "./StatusLabel";

export const CacheKey = ({
  cacheKey,
  cache,
}: {
  cacheKey: string;
  cache: any;
}) => {
  if (isInfiniteCache(cacheKey)) {
    return (
      <CacheText>
        <InfiniteLabel />
        {getInfiniteCacheKey(cacheKey)}
      </CacheText>
    );
  }
  return (
    <CacheText>
      {cache && cache.error && <ErrorLabel />}
      {cache && cache.isLoading && <LoadingLabel />}
      {cache && cache.isValidating && <ValidationgLabel />}
      {cacheKey}
    </CacheText>
  );
};

const CacheText = styled.span`
  display: inline-block;
  padding: 0.3rem;
`;
