import React, { useState } from "react";
import * as CSS from "csstype";
import { useSWRCache } from "../cache";
import { Panel } from "./Panel";
import { CacheInterface } from "swr";

const devToolWindowStyle: CSS.Properties = {
  width: "100%",
  height: "90vh",
  backgroundColor: "#FFF",
  border: "solid 1px #CCC",
  margin: 0,
  padding: 0,
};

const devToolFixedWindowStyle: CSS.Properties = {
  position: "fixed",
  bottom: 0,
  height: "400px",
};

const baseTabStyle: CSS.Properties = {
  display: "inline-block",
  width: "100%",
  height: "100%",
  border: "0",
  backgroundColor: "#FFF",
  padding: "0.5rem 1.5rem",
  cursor: "pointer",
};

const tabStyle: CSS.Properties = {
  ...baseTabStyle,
  borderBottom: "none",
};

const currentTabStyle: CSS.Properties = {
  ...baseTabStyle,
  borderBottom: "solid 2px #BBB",
  backgroundColor: "#F7F5F4",
};

const Tab = ({
  label,
  current,
  onChange,
}: {
  label: string;
  current: boolean;
  onChange: () => void;
}) => (
  <li style={{}}>
    <button
      type="button"
      onClick={onChange}
      style={current ? currentTabStyle : tabStyle}
    >
      {label}
    </button>
  </li>
);

const tabGroupStyle: CSS.Properties = {
  display: "flex",
  //  justifyContent: "space-around",
  borderBottom: "solid 1px #CCC",
  margin: 0,
  listStyle: "none",
  paddingInlineStart: "0",
};

export type PanelType = "current" | "logs";

type Panel = { label: string; key: PanelType };

const panels: Panel[] = [
  {
    label: "Cache",
    key: "current",
  },
  {
    label: "History",
    key: "logs",
  },
];

const TabGroup = ({
  tabs,
  current,
  onChange,
}: {
  tabs: Panel[];
  current: Panel["key"];
  onChange: (active: Panel["key"]) => void;
}) => (
  <ul style={tabGroupStyle}>
    {tabs.map((tab) => (
      <Tab
        key={tab.key}
        label={tab.label}
        current={tab.key === current}
        onChange={() => onChange(tab.key)}
      />
    ))}
  </ul>
);

type Props = {
  cache: CacheInterface;
  isFixedPosition?: boolean;
};
export const SWRDevTools = ({ cache, isFixedPosition = false }: Props) => {
  const [latestCache, cacheLogs] = useSWRCache(cache);
  const [activePanel, setActivePanel] = useState<Panel["key"]>("current");

  return (
    <div
      style={{
        ...devToolWindowStyle,
        ...(isFixedPosition ? devToolFixedWindowStyle : {}),
      }}
    >
      <h3 style={{ position: "absolute", margin: 0, bottom: "0", right: 10 }}>
        SWR Cache
      </h3>
      <TabGroup tabs={panels} current={activePanel} onChange={setActivePanel} />
      {activePanel === "current" && (
        <Panel data={latestCache} type={activePanel} />
      )}
      {activePanel === "logs" && <Panel data={cacheLogs} type={activePanel} />}
    </div>
  );
};
