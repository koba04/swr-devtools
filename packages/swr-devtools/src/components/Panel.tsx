import React, { Suspense, useState, lazy } from "react";
import * as CSS from "csstype";
import { CacheData } from "../cache";
import { PanelType } from "./SWRDevTool";

const panelStyle: CSS.Properties = {
  display: "flex",
  justifyContent: "space-around",
  padding: "0",
  height: "100%",
};

const logsStyle: CSS.Properties = {
  overflow: "scroll",
  overflowY: "scroll",
  height: "100%",
  margin: "0",
  listStyle: "none",
  paddingInlineStart: "0",
};

const logLineStyle: CSS.Properties = {
  borderBottom: "solid 1px #CCC",
  fontSize: "1rem",
  height: "100%",
  margin: 0,
  padding: "0 0.3rem",
};

const AsyncReactJson = ({ data }: { data: any }) => {
  const ReactJson = lazy(() => import("react-json-view"));
  return <ReactJson src={data} />;
};

const CacheDataView = ({ data }: { data: any }) => {
  if (typeof window === "undefined") return null;
  return (
    <Suspense fallback="loading">
      <AsyncReactJson data={data} />
    </Suspense>
  );
};

const CacheDetail = ({ data }: { data: CacheData }) => (
  <div style={logLineStyle}>
    <CacheDataView data={data.data} />
    {data.error && <p style={{ color: "red" }}>{data.error}</p>}
  </div>
);

const panelItemStyle: CSS.Properties = {
  flex: 1,
};

const panelTitleStyle: CSS.Properties = {
  margin: 0,
  padding: "1rem 0.5rem",
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
        <ul style={logsStyle}>
          {cacheData.map(({ id, key, timestampString, timestamp }) => (
            <li
              key={id}
              style={
                selectedItemKey?.key === key &&
                (type === "current" || selectedItemKey?.timestamp === timestamp)
                  ? {
                      backgroundColor: "#F7F5F4",
                      padding: "0.3rem 0",
                      borderBottom: "solid 1px #DDD",
                    }
                  : { padding: "0.3rem 0", borderBottom: "solid 1px #DDD" }
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
