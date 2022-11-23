import React, { useState, createContext, useEffect, useContext } from "react";
import { Theme } from "./SWRDevToolPanel";

const THEME_KEY = "$swr-devtools:theme";

const initialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  // @ts-expect-error
  return localStorage.getItem(THEME_KEY) || "system";
};

const getThemeByPreference = () =>
  typeof window !== "undefined" &&
  matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  setTheme: () => {
    /* */
  },
});

export const useThemePreference = (): [Theme, typeof setTheme] => {
  const { theme, setTheme } = useContext(ThemeContext);
  return [theme, setTheme];
};

export const useTheme = (): Omit<Theme, "system"> => {
  const [theme] = useThemePreference();
  return theme === "system" ? getThemeByPreference() : theme;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  // This is required to avoid hydration mismatch errors
  useEffect(() => {
    setTheme(initialTheme());
  }, []);
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
