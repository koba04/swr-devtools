import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import { useDevToolsCache, SWRCache } from "../devtools-cache";
import { Panel } from "./Panel";
import { Tab } from "./Tab";

export type PanelType = "current" | "history";
export type Panel = { label: string; key: PanelType };

const panels: Panel[] = [
  {
    label: "Cache",
    key: "current",
  },
  {
    label: "History",
    key: "history",
  },
];

type Props = {
  cache: SWRCache;
  isFixedPosition?: boolean;
};

export type ItemKey = {
  key: string;
  timestamp: Date;
};

const GlobalStyle = createGlobalStyle`
  html {
    --swr-devtools-text-color: #000;
    --swr-devtools-bg-color: #FFF;
    --swr-devtools-hover-bg-color: #f7f5f4;
    --swr-devtools-border-color: #CCC;
    --swr-devtools-selected-bg-color: #e6e0dd;
    --swr-devtools-selected-border-color: #bbb;
    --swr-devtools-tag-bg-color: #464242
    --swr-devtools-tag-text-color: #FFF;
    --swr-devtools-error-text-color: red;

    @media (prefers-color-scheme: dark) {
      --swr-devtools-text-color: #FFF;
      --swr-devtools-bg-color: rgb(39, 40, 34);
      --swr-devtools-hover-bg-color: #6d6a66;
      --swr-devtools-border-color: #555454;
      --swr-devtools-selected-bg-color: #524f4d;
      --swr-devtools-selected-border-color: #bbb;
      --swr-devtools-tag-bg-color: #FFF;
      --swr-devtools-tag-text-color: #464242;
      --swr-devtools-error-text-color: red;
    }
  }
`;

export const SWRDevTools = ({ cache }: Props) => {
  const [currentCache, historyCache] = useDevToolsCache(cache);
  const [activePanel, setActivePanel] = useState<Panel["key"]>("current");
  const [selectedItemKey, setSelectedItemKey] = useState<ItemKey | null>(null);
  return (
    <DevToolWindow>
      <GlobalStyle />
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
          data={activePanel === "history" ? historyCache : currentCache}
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
  background-color: var(--swr-devtools-bg-color);
  border-top: solid 1px var(--swr-devtools-border-color);
`;

const Header = styled.header`
  display: flex;
  /* TODO: stop using the fixed size */
  height: 36px;
  color: var(--swr-devtools-text-color);
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
