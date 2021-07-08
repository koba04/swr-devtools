import React from "react";
import * as CSS from "csstype";
import { useSWRCache } from "./cache";

const devToolWindowStyle: CSS.Properties = {
  position: "fixed",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  bottom: 0,
  width: "100%",
  height: "200px",
  backgroundColor: "#EEE",
};

const titleStyle: CSS.Properties = {
  fontSize: "1.2rem",
  margin: "0.3rem",
};

const panelStyle: CSS.Properties = {};

const logsStyle: CSS.Properties = {
  overflow: "scroll",
  height: "calc(200px - 1.8rem - 0.4rem)",
  margin: "0.2rem",
  border: "solid 1px #CCC",
};

const logLineStyle: CSS.Properties = {
  borderBottom: "solid 1px #CCC",
};

const LatestCachePanel = () => {
  const [cacheData] = useSWRCache();
  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>Current Cache</h2>
      <ul style={logsStyle}>
        {cacheData.map(
          ({ key, data, timestampString, isValidating, error }) => (
            <li key={key}>
              {key} ({timestampString})
              <ul style={logLineStyle}>
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
      <ul style={logsStyle}>
        {cacheData.map(
          ({ id, key, data, timestampString, isValidating, error }) => (
            <li key={id}>
              {key} ({timestampString})
              <ul style={logLineStyle}>
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
