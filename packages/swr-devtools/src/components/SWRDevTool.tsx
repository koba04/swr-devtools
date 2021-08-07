import React, { useState } from "react";
import * as CSS from "csstype";
import { useSWRCache } from "../cache";
import { Panel } from "./Panel";
import { CacheInterface } from "swr";

const devToolWindowStyle: CSS.Properties = {
  width: "100%",
  height: "90vh",
  backgroundColor: "#FFF",
  margin: 0,
  padding: 0,
};

const devToolFixedWindowStyle: CSS.Properties = {
  position: "fixed",
  bottom: 0,
  height: "400px",
};

const tabStyle: CSS.Properties = {
  display: "inline-block",
  width: "100%",
  height: "100%",
  border: "none",
  borderBottom: "none",
};

const currentTabStyle: CSS.Properties = {
  display: "inline-block",
  width: "100%",
  height: "100%",
  border: "none",
  borderBottom: "solid 2px #BBB",
  backgroundColor: "#DDD",
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
  <li style={{ width: "100%", height: "44px" }}>
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
  justifyContent: "space-around",
  borderBottom: "solid 1px #CCC",
  marginBottom: "3px",
  listStyle: "none",
  paddingInlineStart: "0",
};

export type PanelType = "current" | "logs";

type Panel = { label: string; key: PanelType };

const panels: Panel[] = [
  {
    label: "Current Cache!",
    key: "current",
  },
  {
    label: "Cache Logs",
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
      <TabGroup tabs={panels} current={activePanel} onChange={setActivePanel} />
      {activePanel === "current" && (
        <Panel data={latestCache} type={activePanel} />
      )}
      {activePanel === "logs" && <Panel data={cacheLogs} type={activePanel} />}
    </div>
  );
};
