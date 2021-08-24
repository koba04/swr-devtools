import React from "react";
import styled from "styled-components";

import { isInfiniteCache, getInfiniteCacheKey } from "../swr-cache";

export const CacheKey = ({
  cacheKey,
  className,
}: {
  cacheKey: string;
  className?: string;
}) => {
  return (
    <Wrapper className={className}>
      {isInfiniteCache(cacheKey) ? (
        <>
          <CacheTag>Infinite</CacheTag>
          {getInfiniteCacheKey(cacheKey)}
        </>
      ) : (
        cacheKey
      )}
    </Wrapper>
  );
};

const Wrapper = styled.span`
  display: inline-block;
`;

const CacheTag = styled.b`
  margin-right: 0.3rem;
  padding: 0.2rem;
  background-color: var(--swr-devtools-tag-bg-color);
  color: var(--swr-devtools-tag-text-color);
`;
