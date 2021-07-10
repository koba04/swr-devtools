import React, { useState } from "react";
import * as CSS from "csstype";
import { CacheData } from "../cache";
import { PanelType } from "./SWRDevTool";

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

export const Panel = ({
  data: cacheData,
  type,
}: {
  data: CacheData[];
  type: PanelType;
}) => {
  const [selectedItemKey, setSelectedItemKey] = useState<{
    key: string;
    timestamp: Date;
  } | null>(null);
  const currentData =
    selectedItemKey &&
    cacheData.find(
      (c) =>
        c.key === selectedItemKey.key &&
        (type === "current" || c.timestamp === selectedItemKey.timestamp)
    );
  return (
    <section style={panelStyle}>
      <div style={panelItemStyle}>
        <h3 style={panelTitleStyle}>Keys</h3>
        <ul style={logsStyle}>
          {cacheData.map(({ id, key, timestampString, timestamp }) => (
            <li
              key={id}
              style={
                selectedItemKey?.key === key &&
                (type === "current" || selectedItemKey?.timestamp === timestamp)
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
                onClick={() => setSelectedItemKey({ key, timestamp })}
              >
                {key} ({timestampString})
              </button>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div style={panelItemStyle}>
        {currentData && (
          <>
            <h3 style={panelTitleStyle}>
              {currentData.key}&nbsp;
              <span style={{ fontSize: "1rem", fontWeight: "normal" }}>
                {currentData.timestampString}
              </span>
            </h3>
            <CacheDetail data={currentData} />
          </>
        )}
      </div>
    </section>
  );
};
