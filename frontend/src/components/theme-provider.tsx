import { useEffect, useState } from "react";
import {
  Theme,
  ColorTheme,
  ThemeProviderContext,
} from "@/contexts/theme-context";
import { useAuth } from "@/hooks/use-auth";
import themeService from "@/services/themeService";

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
  const [initializing, setInitializing] = useState(true);
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
    if (user && initializing) {
      // If user has theme settings in database (attached as user metadata)
      if (user.user_metadata?.theme || user.user_metadata?.colorTheme) {
        const userTheme = user.user_metadata.theme as Theme | undefined;
        const userColorTheme = user.user_metadata.colorTheme as
          | ColorTheme
          | undefined;

        if (userTheme) setTheme(userTheme);
        if (userColorTheme) setColorTheme(userColorTheme);
      }
      setInitializing(false);
    }
  }, [user, initializing]);

  // Reset to default theme when user signs out
  useEffect(() => {
    if (!user && !initializing) {
      // Reset to default themes
      setTheme(defaultTheme);
      setColorTheme(defaultColorTheme);
      setInitializing(false);
    }
  }, [user, defaultTheme, defaultColorTheme, initializing]);

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

    // If user is logged in, save to database
    if (user && !initializing) {
      themeService.updateTheme({ theme }).catch(console.error);
    }
  }, [theme, storageKey, user, initializing]);

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

    // If user is logged in, save to database
    if (user && !initializing) {
      themeService.updateTheme({ colorTheme }).catch(console.error);
    }
  }, [colorTheme, colorStorageKey, user, initializing]);

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
