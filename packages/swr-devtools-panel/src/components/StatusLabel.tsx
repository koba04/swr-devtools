import React from "react";
import styled from "styled-components";

export const ErrorLabel = ({ children }: { children?: string }) => (
  <Label>
    {children && <span aria-label="error">{children}</span>}
    <Icon>❌</Icon>
  </Label>
);

export const LoadingLabel = ({ children }: { children?: string }) => (
  <Label>
    {children && <span aria-label="loading">{children}</span>}
    <Icon>⏳</Icon>
  </Label>
);

export const ValidationgLabel = ({ children }: { children?: string }) => (
  <Label>
    {children && <span aria-label="validating">{children}</span>}
    <Icon>⚠️</Icon>
  </Label>
);

export const InfiniteLabel = ({ children }: { children?: string }) => (
  <Label>
    {children && <span aria-label="infinite">{children}</span>}
    <Icon>
      <span
        style={{
          backgroundColor: "rgba(255, 255, 255, .8)",
          borderRadius: 4,
          padding: 2,
        }}
      >
        ♾️
      </span>
    </Icon>
  </Label>
);

const Label = styled.label`
  display: inline-flex;
  align-items: center;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75em;
  line-height: 0;
`;
