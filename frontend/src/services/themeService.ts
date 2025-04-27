import api from "@/components/api/api";
import { Theme, ColorTheme } from "@/contexts/theme-context";

export interface ThemeSettings {
  theme?: Theme;
  colorTheme?: ColorTheme;
}

export const themeService = {
  /**
   * Updates the user's theme settings
   * @param settings - The theme settings to update
   * @returns The updated theme settings
   */
  async updateTheme(settings: ThemeSettings): Promise<ThemeSettings> {
    const response = await api.put("/auth/update-theme", settings);
    return response.data;
  },

  /**
   * Gets the user's theme settings from localStorage or defaults
   * @returns The current theme settings
   */
  getLocalTheme(): ThemeSettings {
    const theme = localStorage.getItem("vite-ui-theme") as Theme | null;
    const colorTheme = localStorage.getItem("vite-ui-color-theme") as ColorTheme | null;
    
    return {
      theme: theme || "system",
      colorTheme: colorTheme || "default"
    };
  },

  /**
   * Saves theme settings to localStorage
   * @param settings - The theme settings to save
   */
  saveLocalTheme(settings: ThemeSettings): void {
    if (settings.theme) {
      localStorage.setItem("vite-ui-theme", settings.theme);
    }
    
    if (settings.colorTheme) {
      localStorage.setItem("vite-ui-color-theme", settings.colorTheme);
    }
  }
};

export default themeService; 