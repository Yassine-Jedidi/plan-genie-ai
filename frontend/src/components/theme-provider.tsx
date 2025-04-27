import { useEffect, useState } from "react";
import {
  Theme,
  ColorTheme,
  ThemeProviderContext,
} from "@/contexts/theme-context";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();
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

  // Load theme from database when user logs in
  useEffect(() => {
    if (user) {
      // If user has theme settings in database (attached as user metadata)
      if (user.user_metadata?.theme || user.user_metadata?.colorTheme) {
        const userTheme = user.user_metadata.theme as Theme | undefined;
        const userColorTheme = user.user_metadata.colorTheme as
          | ColorTheme
          | undefined;

        if (userTheme) {
          setTheme(userTheme);
          localStorage.setItem(storageKey, userTheme);
        }
        if (userColorTheme) {
          setColorTheme(userColorTheme);
          localStorage.setItem(colorStorageKey, userColorTheme);
        }
      }
    }
  }, [user, storageKey, colorStorageKey]);

  // Reset to default theme when user signs out
  useEffect(() => {
    if (!user) {
      // Reset to default themes
      setTheme(defaultTheme);
      setColorTheme(defaultColorTheme);
    }
  }, [user, defaultTheme, defaultColorTheme]);

  // Handle light/dark theme changes
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

    // Save to localStorage
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

    // Save to localStorage
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
