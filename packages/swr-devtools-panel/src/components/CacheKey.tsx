import React from "react";
import styled from "styled-components";

import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";
import {
  ErrorLabel,
  InfiniteLabel,
  LoadingLabel,
  SubscriptionLabel,
  ValidationgLabel,
} from "./StatusLabel";

const getKey = (cacheData: DevToolsCacheData) => {
  if (cacheData.isInfinite) return cacheData.infiniteKey;
  if (cacheData.isSubscription) return cacheData.subscriptionKey;
  return cacheData.key;
};

export const CacheKey = ({ cacheData }: { cacheData: DevToolsCacheData }) => {
  console.log([cacheData]);
  return (
    <CacheText>
      <div>{getKey(cacheData)}</div>
      <Labels>
        <>
          {cacheData.isSubscription && <SubscriptionLabel />}
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
