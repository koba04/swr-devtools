import React, { useState } from "react";
import styled from "styled-components";
import { CacheInterface } from "swr";

import { useSWRCache } from "../cache";
import { Panel } from "./Panel";
import { Tab } from "./Tab";

export type PanelType = "current" | "logs";
export type Panel = { label: string; key: PanelType };

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

type Props = {
  cache: CacheInterface;
  isFixedPosition?: boolean;
};

export type ItemKey = {
  key: string;
  timestamp: Date;
};

export const SWRDevTools = ({ cache }: Props) => {
  const [latestCache, cacheLogs] = useSWRCache(cache);
  const [activePanel, setActivePanel] = useState<Panel["key"]>("current");
  const [selectedItemKey, setSelectedItemKey] = useState<ItemKey | null>(null);
  return (
    <DevToolWindow>
      <Header>
        <HeaderTitle>SWR</HeaderTitle>
        <Tab
          panels={panels}
          current={activePanel}
          onChange={(panel: PanelType) => {
            setActivePanel(panel);
            setSelectedItemKey(null);
          }}
        />
      </Header>
      <PanelWrapper>
        <Panel
          data={activePanel === "logs" ? cacheLogs : latestCache}
          type={activePanel}
          selectedItemKey={selectedItemKey}
          onSelectItem={setSelectedItemKey}
        />
      </PanelWrapper>
    </DevToolWindow>
  );
};

const DevToolWindow = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  background-color: #fff;
  border-top: solid 1px #ccc;
`;

const Header = styled.header`
  display: flex;
  /* TODO: stop using the fixed size */
  height: 40px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  padding: 0.2rem 1rem;
  align-self: center;
`;

const PanelWrapper = styled.div`
  position: relative;
  height: calc(100% - 40px);
  width: 100%;
`;
