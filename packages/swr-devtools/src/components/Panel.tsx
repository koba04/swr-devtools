import React, { useState } from "react";
import * as CSS from "csstype";
import { CacheData } from "../cache";

const panelStyle: CSS.Properties = {
  display: "flex",
  justifyContent: "space-around",
  padding: "2px",
  height: "100%",
};

const logsStyle: CSS.Properties = {
  overflow: "scroll",
  overflowY: "scroll",
  height: "100%",
  margin: "0.2rem",
  listStyle: "none",
  paddingInlineStart: "0",
};

const logLineStyle: CSS.Properties = {
  borderBottom: "solid 1px #CCC",
  height: "100%",
};

const CacheDetail = ({ data }: { data: CacheData }) => (
  <ul style={logLineStyle}>
    <li>data: {JSON.stringify(data.data)}</li>
    <li>isValidating: {data.isValidating.toString()}</li>
    <li>error: {data.error || "null"}</li>
  </ul>
);

const panelItemStyle: CSS.Properties = {
  flex: 1,
};

const panelTitleStyle: CSS.Properties = {
  margin: "5px",
};

export const Panel = ({ data: cacheData }: { data: CacheData[] }) => {
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  return (
    <section style={panelStyle}>
      <div style={panelItemStyle}>
        <h3 style={panelTitleStyle}>Keys</h3>
        <ul style={logsStyle}>
          {cacheData.map(({ id, key, timestampString }) => (
            <li
              key={id}
              style={
                selectedItemKey === key
                  ? { backgroundColor: "#DDD", padding: "0.3rem 0" }
                  : { padding: "0.3rem 0" }
              }
            >
              <button
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                }}
                onClick={() => setSelectedItemKey(key)}
              >
                {key} ({timestampString})
              </button>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div style={panelItemStyle}>
        <h3 style={panelTitleStyle}>Data</h3>
        {selectedItemKey !== null && (
          <CacheDetail
            data={cacheData.find((c) => c.key === selectedItemKey)!}
          />
        )}
      </div>
    </section>
  );
};
