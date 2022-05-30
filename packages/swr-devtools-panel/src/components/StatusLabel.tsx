import React from "react";

export const ErrorLabel = ({ children }: { children?: string }) => (
  <span aria-label="error">❌&nbsp;{children}</span>
);

export const LoadingLabel = ({ children }: { children?: string }) => (
  <span aria-label="loading">⏳&nbsp;{children}</span>
);

export const ValidationgLabel = ({ children }: { children?: string }) => (
  <span aria-label="validating">⚠️&nbsp;{children}</span>
);

export const InfiniteLabel = ({ children }: { children?: string }) => (
  <span aria-label="infinite">
    <span style={{ backgroundColor: "white" }}>♾️</span>&nbsp;{children}
  </span>
);
