import React from "react";
import styled from "styled-components";

import {
  isInfiniteCache,
  getInfiniteCacheKey,
} from "swr-devtools/lib/swr-cache";

export const CacheKey = ({ cacheKey }: { cacheKey: string }) => {
  if (isInfiniteCache(cacheKey)) {
    return (
      <CacheText>
        <CacheTag>Infinite</CacheTag>
        {getInfiniteCacheKey(cacheKey)}
      </CacheText>
    );
  }
  return <CacheText>{cacheKey}</CacheText>;
};

const CacheText = styled.span`
  display: inline-block;
  padding: 0.3rem;
`;

const CacheTag = styled.b`
  margin-right: 0.3rem;
  padding: 0.2rem;
  background-color: var(--swr-devtools-tag-bg-color);
  color: var(--swr-devtools-tag-text-color);
`;
