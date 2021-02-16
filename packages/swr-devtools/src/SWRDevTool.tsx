import React from "react";
import * as CSS from "csstype";
import { useSWRCache } from "./cache";

const devToolWindowStyle: CSS.Properties = {
  position: "fixed",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  bottom: 0,
  overflow: "scroll",
  width: "100%",
  height: "200px",
  backgroundColor: "#EEE",
};

const titleStyle: CSS.Properties = {
  position: "sticky",
  top: 0,
  margin: "0.5rem",
  backgroundColor: "#EEE",
};

const panelStyle: CSS.Properties = {};

const LatestCachePanel = () => {
  const [cacheData] = useSWRCache();
  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>Current Cache</h2>
      <ul>
        {cacheData.map(
          ({ key, data, timestampString, isValidating, error }) => (
            <li key={key}>
              {key} ({timestampString})
              <ul>
                <li>data: {JSON.stringify(data)}</li>
                <li>isValidating: {isValidating.toString()}</li>
                <li>error: {error || "null"}</li>
              </ul>
            </li>
          )
        )}
      </ul>
    </section>
  );
};

const LogsPanel = () => {
  const [_, cacheData] = useSWRCache();
  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>Cache Logs</h2>
      <ul>
        {cacheData.map(
          ({ id, key, data, timestampString, isValidating, error }) => (
            <li key={id}>
              {key} ({timestampString})
              <ul>
                <li>data: {JSON.stringify(data)}</li>
                <li>isValidating: {isValidating.toString()}</li>
                <li>error: {error || "null"}</li>
              </ul>
            </li>
          )
        )}
      </ul>
    </section>
  );
};

export const SWRDevTools = () => {
  return (
    <div style={devToolWindowStyle}>
      <LatestCachePanel />
      <LogsPanel />
    </div>
  );
};
