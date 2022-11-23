import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Theme } from "./SWRDevToolPanel";
import { useThemePreference } from "./ThemeProvider";

export const ThemeSwitcher = ({ activePanel }: { activePanel: string }) => {
  const [theme, setTheme] = useThemePreference();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const changeModeType = (ev: React.UIEvent<HTMLDivElement>) => {
    const newTheme = (
      ev.target as HTMLElement
    ).textContent?.toLowerCase() as Theme;
    console.log({ newTheme });
    setTheme(newTheme);
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
      <div>{theme[0].toUpperCase() + theme.slice(1)}</div>
      <ColorModeIconWrapper>
        {theme === "system" || theme === "light" ? (
          <svg viewBox="0 0 20 20" width="1em" height="1em" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="1em" height="1em" fill="#FFF">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </ColorModeIconWrapper>
      <ColorModeMenu showMenu={showMenu}>
        <ColorModeItem
          selectedMode={theme === "light"}
          onClick={changeModeType}
        >
          Light
        </ColorModeItem>
        <ColorModeItem selectedMode={theme === "dark"} onClick={changeModeType}>
          Dark
        </ColorModeItem>
        <ColorModeItem
          selectedMode={theme === "system"}
          onClick={changeModeType}
        >
          System
        </ColorModeItem>
      </ColorModeMenu>
    </ColorModeWrapper>
  );
};

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
