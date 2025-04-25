import { useEffect, useState } from "react";
import {
  Theme,
  ColorTheme,
  ThemeProviderContext,
} from "@/contexts/theme-context";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  storageKey?: string;
  colorStorageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "default",
  storageKey = "vite-ui-theme",
  colorStorageKey = "vite-ui-color-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    return storedTheme || defaultTheme;
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const storedColorTheme = localStorage.getItem(
      colorStorageKey
    ) as ColorTheme;
    return storedColorTheme || defaultColorTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Handle light/dark theme
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    if (theme !== "system") {
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey]);

  // Handle color theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all color theme classes
    root.classList.remove(
      "theme-default",
      "theme-red",
      "theme-blue",
      "theme-green",
      "theme-purple",
      "theme-orange",
      "theme-pink",
      "theme-teal"
    );

    // Add the selected color theme class
    root.classList.add(`theme-${colorTheme}`);

    // Store the color theme preference
    localStorage.setItem(colorStorageKey, colorTheme);
  }, [colorTheme, colorStorageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
    colorTheme,
    setColorTheme: (newColorTheme: ColorTheme) => {
      setColorTheme(newColorTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
