export type Theme = "dark" | "light" | "system";
export type ColorTheme =
  | "default"
  | "red"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "teal";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
};

export interface ThemeSettings {
  theme?: Theme;
  colorTheme?: ColorTheme;
} 