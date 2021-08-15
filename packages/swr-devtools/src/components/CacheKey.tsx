import React from "react";
import styled from "styled-components";

import { isInfiniteCache, getInfiniteCacheKey } from "../swr-cache";

export const CacheKey = ({ cacheKey }: { cacheKey: string }) => {
  if (isInfiniteCache(cacheKey)) {
    return (
      <span>
        <CacheTag>Infinite</CacheTag>
        {getInfiniteCacheKey(cacheKey)}
      </span>
    );
  }
  return <span>{cacheKey}</span>;
};

const CacheTag = styled.b`
  margin-right: 0.3rem;
  padding: 0.2rem;
  background-color: #464242;
  color: white;
`;
