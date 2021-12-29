import React from "react";
import styled from "styled-components";

export const ErrorLabel = () => <ErrorLabelWrapper>ERROR</ErrorLabelWrapper>;

const ErrorLabelWrapper = styled.span`
  padding: 0.2rem;
  background-color: var(--swr-devtools-error-text-color);
  color: var(--swr-devtools-text-color);
`;
