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
      {devToolsCacheData.isInfinite && <InfiniteLabel />}
      {devToolsCacheData.error && <ErrorLabel />}
      {devToolsCacheData.isLoading && <LoadingLabel />}
      {devToolsCacheData.isValidating && <ValidationgLabel />}
      {devToolsCacheData.isInfinite
        ? devToolsCacheData.infiniteKey
        : devToolsCacheData.key}
    </CacheText>
  );
};

const CacheText = styled.span`
  display: inline-block;
  padding: 0.3rem;
`;
