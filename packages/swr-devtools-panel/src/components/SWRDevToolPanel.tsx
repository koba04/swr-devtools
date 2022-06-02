import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Cache } from "swr";
import { NetworkPanel, EventEmitter } from "./NetworkPanel";
import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";

import { Panel } from "./Panel";
import { Tab } from "./Tab";

export type PanelType = "current" | "history" | "network";
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
  {
    label: "Network",
    key: "network",
  },
];

type Props = {
  cache: Cache | null;
  events: EventEmitter | null;
  isFixedPosition?: boolean;
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
    --swr-devtools-timeline-ruler-color: #0000001f;
    --swr-devtools-timeline-scale-color: #ddd;
    --swr-devtools-timeline-track-color: #333;
    --swr-devtools-network-panel-color: #555;
    --swr-devtools-network-panel-bg-color: #f3f3f3;
    --swr-devtools-network-row-bg-color: #fff;
    --swr-devtools-network-row-bg-alt-color: #f8f8f8;
    --swr-devtools-network-hovered-row-bg-color: #eee;

    @media (prefers-color-scheme: dark) {
      --swr-devtools-text-color: #FFF;
      --swr-devtools-bg-color: #292a2d;
      --swr-devtools-hover-bg-color: #6d6a66;
      --swr-devtools-border-color: #555454;
      --swr-devtools-selected-bg-color: #524f4d;
      --swr-devtools-selected-border-color: #bbb;
      --swr-devtools-tag-bg-color: #FFF;
      --swr-devtools-tag-text-color: #464242;
      --swr-devtools-error-text-color: red;
      --swr-devtools-timeline-ruler-color: #ffffff2f;
      --swr-devtools-timeline-scale-color: #888;
      --swr-devtools-timeline-track-color: #aaa;
      --swr-devtools-network-panel-color: #999;
      --swr-devtools-network-panel-bg-color: #2a2a2a;
      --swr-devtools-network-row-bg-color: #202020;
      --swr-devtools-network-row-bg-alt-color: #2f2f2f;
      --swr-devtools-network-hovered-row-bg-color: #333;
    }
  }
`;

export const SWRDevToolPanel = ({ cache, events }: Props) => {
  const [activePanel, setActivePanel] = useState<Panel["key"]>("current");
  const [selectedDevToolsCacheData, selectDevToolsCacheData] =
    useState<DevToolsCacheData | null>(null);
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
            selectDevToolsCacheData(null);
          }}
        />
      </Header>
      <PanelWrapper>
        {cache !== null && events !== null ? (
          activePanel === "network" ? (
            <NetworkPanel cache={cache} events={events} type={activePanel} />
          ) : (
            <Panel
              cache={cache}
              type={activePanel}
              selectedItemKey={selectedDevToolsCacheData}
              onSelectItem={selectDevToolsCacheData}
            />
          )
        ) : (
          <NoteText>
            Haven&apos;t received any cache data from SWRDevTools
          </NoteText>
        )}
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

const NoteText = styled.p`
  color: var(--swr-devtools-text-color);
`;
