import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Cache } from "swr";
import { NetworkPanel } from "./NetworkPanel";
import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";

import { CachePanel } from "./CachePanel";
import { HistoryPanel } from "./HistoryPanel";
import { Tab } from "./Tab";
import { EventEmitter, useRequests, useTracks } from "../request";
import { useDevToolsCache } from "../devtools-cache";

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
      --swr-devtools-hover-bg-color: #37383b;
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
  const [selectedHistoryData, setSelectedHistoryData] = useState<any>(null);

  const requestsById = useRequests(events);
  const tracks = useTracks(requestsById);
  const startTime = useState(() => Date.now())[0];
  const cacheData = useDevToolsCache(cache);

  return (
    <DevToolWindow>
      {/* @ts-expect-error https://github.com/styled-components/styled-components/issues/3738 */}
      <GlobalStyle />
      <Header>
        <HeaderLogoWrapper>
          <svg height="12" viewBox="0 0 291 69" fill="none">
            <path
              d="M0 36.53c.07 17.6 14.4 32.01 32.01 32.01a32.05 32.05 0 0032.01-32V32a13.2 13.2 0 0123.4-8.31h20.7A32.07 32.07 0 0077.2 0a32.05 32.05 0 00-32 32.01v4.52A13.2 13.2 0 0132 49.71a13.2 13.2 0 01-13.18-13.18 3.77 3.77 0 00-3.77-3.77H3.76A3.77 3.77 0 000 36.53zM122.49 68.54a32.14 32.14 0 01-30.89-23.7h20.67a13.16 13.16 0 0023.4-8.3V32A32.05 32.05 0 01167.68 0c17.43 0 31.64 14 32 31.33l.1 5.2a13.2 13.2 0 0023.4 8.31h20.7a32.07 32.07 0 01-30.91 23.7c-17.61 0-31.94-14.42-32.01-32l-.1-4.7v-.2a13.2 13.2 0 00-13.18-12.81 13.2 13.2 0 00-13.18 13.18v4.52a32.05 32.05 0 01-32.01 32.01zM247.94 23.7a13.16 13.16 0 0123.4 8.31 3.77 3.77 0 003.77 3.77h11.3a3.77 3.77 0 003.76-3.77A32.05 32.05 0 00258.16 0a32.07 32.07 0 00-30.92 23.7h20.7z"
              fill="currentColor"
            />
          </svg>
          <HeaderTitle>SWR</HeaderTitle>
        </HeaderLogoWrapper>
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
            <NetworkPanel
              requestsById={requestsById}
              tracks={tracks}
              startTime={startTime}
            />
          ) : activePanel === "history" ? (
            <HistoryPanel
              tracks={tracks}
              selectedItem={selectedHistoryData}
              onSelectedItem={(data: any) => setSelectedHistoryData(data)}
            />
          ) : (
            <CachePanel
              cacheData={cacheData}
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
  box-sizing: border-box;
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

const HeaderLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
  padding-right: 16px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  user-select: none;
`;

const PanelWrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 36px);
`;

const NoteText = styled.p`
  color: var(--swr-devtools-text-color);
`;
