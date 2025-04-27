import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Sun, Moon } from "lucide-react";
import { ColorTheme, Theme } from "@/contexts/theme-context";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import themeService from "@/services/themeService";

const colorThemes = [
  { name: "Default", primary: "hsl(222.2, 47.4%, 11.2%)", color: "#1e293b" },
  { name: "Red", primary: "hsl(0, 72%, 51%)", color: "#ef4444" },
  { name: "Blue", primary: "hsl(217, 91%, 60%)", color: "#3b82f6" },
  { name: "Green", primary: "hsl(142, 71%, 45%)", color: "#10b981" },
  { name: "Purple", primary: "hsl(280, 67%, 55%)", color: "#a855f7" },
  { name: "Orange", primary: "hsl(24, 95%, 58%)", color: "#f97316" },
  { name: "Pink", primary: "hsl(330, 81%, 60%)", color: "#ec4899" },
  { name: "Teal", primary: "hsl(180, 70%, 48%)", color: "#14b8a6" },
];

export default function SettingsPage() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  const { isMobile } = useSidebar();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleThemeChange = (newTheme: ColorTheme) => {
    setSaving(true);

    // Update local theme immediately for responsive UI
    setColorTheme(newTheme);

    // Save to database
    if (user) {
      themeService
        .updateTheme({ colorTheme: newTheme })
        .then(() => {
          toast.success("Color theme updated successfully!");
        })
        .catch((error) => {
          console.error("Failed to save color theme:", error);
          toast.error("Failed to save color theme settings");
        })
        .finally(() => {
          setSaving(false);
        });
    } else {
      setSaving(false);
    }
  };

  const handleModeChange = (newMode: Theme) => {
    setSaving(true);

    // Update theme mode immediately
    setTheme(newMode);

    // Save to database
    if (user) {
      themeService
        .updateTheme({ theme: newMode })
        .then(() => {
          toast.success("Theme mode updated successfully!");
        })
        .catch((error) => {
          console.error("Failed to save theme mode:", error);
          toast.error("Failed to save theme mode settings");
        })
        .finally(() => {
          setSaving(false);
        });
    } else {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 w-full">
      <div className="space-y-6 w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <span className="text-primary text-3xl font-bold">Settings</span>
          {isMobile && <SidebarTrigger className="h-9 w-9 border rounded-md" />}
        </div>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>

        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Theme Mode</CardTitle>
                <CardDescription>
                  Choose between light and dark mode
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {theme === "light" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {theme === "system"
                        ? "System"
                        : theme === "dark"
                        ? "Dark"
                        : "Light"}{" "}
                      Mode
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModeChange("light")}
                      className={theme === "light" ? "border-primary" : ""}
                      disabled={saving}
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      Light
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModeChange("dark")}
                      className={theme === "dark" ? "border-primary" : ""}
                      disabled={saving}
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Dark
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModeChange("system")}
                      className={theme === "system" ? "border-primary" : ""}
                      disabled={saving}
                    >
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Theme</CardTitle>
                <CardDescription>
                  Choose your preferred color theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {colorThemes.map((colorScheme) => (
                    <Button
                      key={colorScheme.name}
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 p-4 gap-2 hover:border-primary"
                      onClick={() =>
                        handleThemeChange(
                          colorScheme.name.toLowerCase() as ColorTheme
                        )
                      }
                      disabled={saving}
                    >
                      <div
                        className="w-10 h-10 rounded-full border"
                        style={{ backgroundColor: colorScheme.color }}
                      >
                        {colorTheme === colorScheme.name.toLowerCase() && (
                          <div className="flex items-center justify-center h-full">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs">{colorScheme.name}</span>
                    </Button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Your theme preferences are saved to your account and
                  synchronized across devices.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notification settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
