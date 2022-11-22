import React, { useState, useEffect } from "react";
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

interface ModeProps {
  dark: boolean;
  system: boolean;
}

const GlobalStyle = createGlobalStyle<ModeProps>`${(props) => `
  html {
    --swr-devtools-text-color: ${props.dark ? "#FFF" : "#000"};
    --swr-devtools-bg-color: ${props.dark ? "#292a2d" : "#FFF"};
    --swr-devtools-hover-bg-color: ${props.dark ? "#37383b" : "#f7f5f4"};
    --swr-devtools-border-color: ${props.dark ? "#555454" : "#CCC"};
    --swr-devtools-selected-bg-color: ${props.dark ? "#524f4d" : "#e6e0dd"};
    --swr-devtools-selected-border-color: #bbb;
    --swr-devtools-tag-bg-color: ${props.dark ? "#FFF" : "#464242"};
    --swr-devtools-tag-text-color: ${props.dark ? "#464242" : "#FFF"};
    --swr-devtools-error-text-color: red;
    --swr-devtools-timeline-ruler-color: ${
      props.dark ? "#ffffff2f" : "#0000001f"
    };
    --swr-devtools-timeline-scale-color: ${props.dark ? "#888" : "#ddd"};
    --swr-devtools-timeline-track-color: ${props.dark ? "#aaa" : "#333"};
    --swr-devtools-network-panel-color: ${props.dark ? "#999" : "#555"};
    --swr-devtools-network-panel-bg-color: ${
      props.dark ? "#2a2a2a" : "#f3f3f3"
    };
    --swr-devtools-network-row-bg-color: ${props.dark ? "#202020" : "#FFF"};
    --swr-devtools-network-row-bg-alt-color: ${
      props.dark ? "#2f2f2f" : "#f8f8f8"
    };
    --swr-devtools-network-hovered-row-bg-color: ${
      props.dark ? "#333" : "#eee"
    };

    @media (prefers-color-scheme: dark) {
      --swr-devtools-text-color: ${
        props.system || props.dark ? "#FFF" : "#000"
      };
      --swr-devtools-bg-color: ${
        props.system || props.dark ? "#292a2d" : "#FFF"
      };
      --swr-devtools-hover-bg-color: ${
        props.system || props.dark ? "#37383b" : "#f7f5f4"
      };
      --swr-devtools-border-color: ${
        props.system || props.dark ? "#555454" : "#CCC"
      };
      --swr-devtools-selected-bg-color: ${
        props.system || props.dark ? "#524f4d" : "#e6e0dd"
      };
      --swr-devtools-selected-border-color: #bbb;
      --swr-devtools-tag-bg-color: ${
        props.system || props.dark ? "#FFF" : "#464242"
      };
      --swr-devtools-tag-text-color: ${
        props.system || props.dark ? "#464242" : "#FFF"
      };
      --swr-devtools-error-text-color: red;
      --swr-devtools-timeline-ruler-color: ${
        props.system || props.dark ? "#ffffff2f" : "#0000001f"
      };
      --swr-devtools-timeline-scale-color: ${
        props.system || props.dark ? "#888" : "#ddd"
      };
      --swr-devtools-timeline-track-color: ${
        props.system || props.dark ? "#aaa" : "#333"
      };
      --swr-devtools-network-panel-color: ${
        props.system || props.dark ? "#999" : "#555"
      };
      --swr-devtools-network-panel-bg-color: ${
        props.system || props.dark ? "#2a2a2a" : "#f3f3f3"
      };
      --swr-devtools-network-row-bg-color: ${
        props.system || props.dark ? "#202020" : "#FFF"
      };
      --swr-devtools-network-row-bg-alt-color: ${
        props.system || props.dark ? "#2f2f2f" : "#f8f8f8"
      };
      --swr-devtools-network-hovered-row-bg-color: ${
        props.system || props.dark ? "#333" : "#eee"
      };
    }
  }
`}`;

function useColorMode() {
  const [modeType, setModeType] = useState<string>("System");

  typeof window !== "undefined" &&
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("swr-devtools-color-mode", modeType);
    });

  useEffect(() => {
    const savedMode =
      localStorage.getItem("swr-devtools-color-mode") || "System";
    setModeType(savedMode);
  }, []);

  return { modeType, setModeType };
}

export const SWRDevToolPanel = ({ cache, events }: Props) => {
  const [activePanel, setActivePanel] = useState<Panel["key"]>("current");
  const [selectedDevToolsCacheData, selectDevToolsCacheData] =
    useState<DevToolsCacheData | null>(null);
  const [selectedHistoryData, setSelectedHistoryData] = useState<any>(null);

  const requestsById = useRequests(events);
  const tracks = useTracks(requestsById);
  const startTime = useState(() => Date.now())[0];
  const cacheData = useDevToolsCache(cache);
  const { modeType, setModeType } = useColorMode();

  return (
    <DevToolWindow>
      {/* @ts-expect-error https://github.com/styled-components/styled-components/issues/3738 */}
      <GlobalStyle dark={modeType === "Dark"} system={modeType === "System"} />
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
        <ColorMode
          modeType={modeType}
          setModeType={setModeType}
          activePanel={activePanel}
        />
      </Header>
      <PanelWrapper>
        {cache !== null && events !== null ? (
          activePanel === "network" ? (
            <NetworkPanel
              requestsById={requestsById}
              tracks={tracks}
              startTime={startTime}
              modeType={modeType}
            />
          ) : activePanel === "history" ? (
            <HistoryPanel
              tracks={tracks}
              selectedItem={selectedHistoryData}
              onSelectedItem={(data: any) => setSelectedHistoryData(data)}
              modeType={modeType}
            />
          ) : (
            <CachePanel
              cacheData={cacheData}
              selectedItem={selectedDevToolsCacheData}
              onSelectItem={selectDevToolsCacheData}
              modeType={modeType}
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

function ColorMode({
  modeType,
  setModeType,
  activePanel,
}: {
  modeType: string;
  setModeType: (nextMode: string) => void;
  activePanel: string;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (!showMenu) setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    if (showMenu) setShowMenu(false);
  };

  const changeModeType = (ev: React.UIEvent<HTMLDivElement>) => {
    const newMode = (ev.target as HTMLElement).textContent as string;
    setModeType(newMode);
    closeMenu();
  };

  useEffect(() => {
    const closeMenuOnWindow = (ev: MouseEvent) => {
      const element = (ev.target as HTMLElement).textContent;
      if (element !== "Dark" && element !== "Light" && element !== "System")
        closeMenu();
    };
    window.addEventListener("click", closeMenuOnWindow);
    return () => window.removeEventListener("click", closeMenuOnWindow);
  });

  // Hide theme button on network tab
  if (activePanel === "network") return null;

  return (
    <ColorModeWrapper onClick={openMenu}>
      <div>{modeType}</div>
      <ColorModeIconWrapper>
        {modeType === "System" || modeType === "Light" ? (
          <svg viewBox="0 0 20 20" width="1em" height="1em" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="1em" height="1em" fill="#FFF">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        )}
      </ColorModeIconWrapper>
      <ColorModeMenu showMenu={showMenu}>
        <ColorModeItem
          selectedMode={modeType === "Light"}
          onClick={changeModeType}
        >
          Light
        </ColorModeItem>
        <ColorModeItem
          selectedMode={modeType === "Dark"}
          onClick={changeModeType}
        >
          Dark
        </ColorModeItem>
        <ColorModeItem
          selectedMode={modeType === "System"}
          onClick={changeModeType}
        >
          System
        </ColorModeItem>
      </ColorModeMenu>
    </ColorModeWrapper>
  );
}

const ColorModeWrapper = styled.button`
  border: 0;
  background-color: var(--swr-devtools-bg-color);
  color: var(--swr-devtools-text-color);
  margin: auto 1rem auto auto;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: var(--swr-devtools-hover-bg-color);
  }
`;

const ColorModeIconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 4px;
`;

const ColorModeMenu = styled.div<{ showMenu: boolean }>`
  display: ${(props) => (props.showMenu ? "flex" : "none")};
  flex-direction: column;
  background-color: var(--swr-devtools-bg-color);
  width: 5rem;
  height: 5rem;
  position: absolute;
  right: 0;
  top: 1.3rem;
  border: solid 1px var(--swr-devtools-border-color);
  border-radius: 4px;
  z-index: 1;
`;

const ColorModeItem = styled.div<{ selectedMode: boolean }>`
  width: calc(100% - 4px);
  display: flex;
  align-items: center;
  padding-left: 4px;
  cursor: pointer;
  flex-grow: 1;
  background-color: ${({ selectedMode }) =>
    selectedMode
      ? "var(--swr-devtools-selected-bg-color)"
      : "var(--swr-devtools-bg-color)"};

  &:hover {
    background-color: ${({ selectedMode }) =>
      selectedMode
        ? "var(--swr-devtools-selected-bg-color)"
        : "var(--swr-devtools-hover-bg-color)"};
  }
`;

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
