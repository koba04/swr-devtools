import React from "react";
import * as CSS from "csstype";
import { useSWRCache } from "./cache";

const style: CSS.Properties = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  height: "200px",
  opacity: 0.5,
  backgroundColor: "#EEE",
};

const DataPanel = () => {
  const cacheData = useSWRCache();
  return (
    <ul>
      {cacheData.map(({ key, data, timestampString, isValidating, error }) => (
        <li key={key}>
          {key} ({timestampString})
          <ul>
            <li>data: {JSON.stringify(data)}</li>
            <li>isValidating: {isValidating.toString()}</li>
            <li>error: {error || "null"}</li>
          </ul>
        </li>
      ))}
    </ul>
  );
};

export const SWRDevTools = () => {
  return (
    <div style={style}>
      <DataPanel />
    </div>
  );
};
