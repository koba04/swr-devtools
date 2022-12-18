import React from "react";
import styled from "styled-components";
import { Theme } from "./SWRDevToolPanel";
import { useThemePreference } from "./ThemeProvider";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useThemePreference();

  const changeModeType = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeSwitcherWrapper>
      <ThemeSwitcherIconWrapper>
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
      </ThemeSwitcherIconWrapper>
      <ThemeSelect
        value={theme}
        onChange={(e) => changeModeType(e.target.value as Theme)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </ThemeSelect>
    </ThemeSwitcherWrapper>
  );
};

const ThemeSwitcherWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;

const ThemeSwitcherIconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 4px;
`;

const ThemeSelect = styled.select`
  width: 5rem;
  height: 36px;
  border: none;
  font-size: 0.8rem;
  color: var(--swr-devtools-text-color);
  background-color: var(--swr-devtools-bg-color);
`;
