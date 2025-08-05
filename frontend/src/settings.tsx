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
import {
  Check,
  Sun,
  Moon,
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  Bell,
  CheckSquare,
  Calendar,
  Info,
} from "lucide-react";
import { ColorTheme, Theme } from "@/contexts/theme-context";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import themeService from "@/services/themeService";
import { Switch } from "@/components/ui/switch";
import { notificationService } from "@/services/notificationService";
import { useTranslation } from "react-i18next";
import { LanguageSwitch } from "@/components/language-switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { accountService } from "@/services/accountService";

const colorThemes = [
  { name: "default", primary: "hsl(222.2, 47.4%, 11.2%)", color: "#1e293b" },
  { name: "red", primary: "hsl(0, 72%, 51%)", color: "#ef4444" },
  { name: "blue", primary: "hsl(217, 91%, 60%)", color: "#3b82f6" },
  { name: "green", primary: "hsl(142, 71%, 45%)", color: "#10b981" },
  { name: "purple", primary: "hsl(280, 67%, 55%)", color: "#a855f7" },
  { name: "orange", primary: "hsl(24, 95%, 58%)", color: "#f97316" },
  { name: "pink", primary: "hsl(330, 81%, 60%)", color: "#ec4899" },
  { name: "teal", primary: "hsl(180, 70%, 48%)", color: "#14b8a6" },
];

export default function SettingsPage() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  const { isMobile } = useSidebar();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [receiveTaskNotifications, setReceiveTaskNotifications] = useState(
    user?.receive_task_notifications ?? true
  );
  const [receiveEventNotifications, setReceiveEventNotifications] = useState(
    user?.receive_event_notifications ?? true
  );
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Account management state
  const [exportingData, setExportingData] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchPreferences() {
      try {
        const prefs = await notificationService.getNotificationPreferences();
        if (isMounted) {
          setReceiveTaskNotifications(prefs.receive_task_notifications);
          setReceiveEventNotifications(prefs.receive_event_notifications);
        }
      } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
      } finally {
        if (isMounted) setLoadingPreferences(false);
      }
    }
    fetchPreferences();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleThemeChange = (newTheme: ColorTheme) => {
    setSaving(true);

    // Update local theme immediately for responsive UI
    setColorTheme(newTheme);

    // Save to database
    if (user) {
      themeService
        .updateTheme({ colorTheme: newTheme })
        .then(() => {
          toast.success(t("settings.colorThemeUpdated"));
        })
        .catch((error) => {
          console.error("Failed to save color theme:", error);
          toast.error(t("settings.colorThemeFailed"));
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
          toast.success(t("settings.themeModeUpdated"));
        })
        .catch((error) => {
          console.error("Failed to save theme mode:", error);
          toast.error(t("settings.themeModeFailed"));
        })
        .finally(() => {
          setSaving(false);
        });
    } else {
      setSaving(false);
    }
  };

  const handleNotificationPreferenceChange = async (
    type: "task" | "event",
    checked: boolean
  ) => {
    setSaving(true);
    try {
      if (type === "task") {
        setReceiveTaskNotifications(checked);
        await notificationService.updateNotificationPreferences({
          receive_task_notifications: checked,
        });
      } else {
        setReceiveEventNotifications(checked);
        await notificationService.updateNotificationPreferences({
          receive_event_notifications: checked,
        });
      }
      toast.success(
        t("settings.notificationToast", {
          receive: checked ? t("settings.receive") : t("settings.notReceive"),
          type: type === "task" ? t("settings.task") : t("settings.event"),
        })
      );
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
      toast.error(t("settings.failedToSavePreferences"));
    } finally {
      setSaving(false);
    }
  };

  // Account management handlers
  const handleExportData = async () => {
    setExportingData(true);
    try {
      const result = await accountService.exportData();

      if (result.success) {
        // Create a downloadable JSON file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });

        // Create download link
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `plan-genie-data-${
          new Date().toISOString().split("T")[0]
        }.json`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(url);

        toast.success(t("settings.exportDataSuccess"));
      } else {
        throw new Error(result.error || "Data export failed");
      }
    } catch (error) {
      console.error("Failed to export data:", error);
      toast.error((error as Error).message || t("settings.exportDataError"));
    } finally {
      setExportingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      toast.error(
        "Please confirm that you understand this action cannot be undone."
      );
      return;
    }

    if (!user) {
      toast.error("You must be logged in to delete your account.");
      return;
    }

    setDeletingAccount(true);
    try {
      const result = await accountService.deleteAccount();

      if (result.success) {
        toast.success(t("settings.deleteAccountSuccess"));
        navigate("/");
      } else {
        throw new Error(result.error || "Account deletion failed");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error((error as Error).message || t("settings.deleteAccountError"));
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <>
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>
      <div className="flex flex-col items-center py-6 w-full">
        <div className="space-y-6 w-full max-w-2xl">
          <div className="flex items-center justify-between">
            <span className="text-primary text-3xl font-bold">
              {t("settings.title")}
            </span>
            {isMobile && (
              <SidebarTrigger className="h-9 w-9 border rounded-md" />
            )}
          </div>
          <p className="text-muted-foreground">{t("settings.description")}</p>

          <Tabs defaultValue="appearance">
            <TabsList className="mb-4">
              <TabsTrigger value="appearance">
                {t("settings.appearance")}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                {t("settings.notifications")}
              </TabsTrigger>
              <TabsTrigger value="language">
                {t("settings.language")}
              </TabsTrigger>
              <TabsTrigger value="account">{t("settings.account")}</TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">
                    {t("settings.themeMode")}
                  </CardTitle>
                  <CardDescription>
                    {t("settings.themeModeDescription")}
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
                          ? t("settings.mode.system")
                          : theme === "dark"
                          ? t("settings.mode.dark")
                          : t("settings.mode.light")}
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
                        {t("settings.light")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModeChange("dark")}
                        className={theme === "dark" ? "border-primary" : ""}
                        disabled={saving}
                      >
                        <Moon className="h-4 w-4 mr-1" />
                        {t("settings.dark")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModeChange("system")}
                        className={theme === "system" ? "border-primary" : ""}
                        disabled={saving}
                      >
                        {t("settings.system")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.colorTheme")}</CardTitle>
                  <CardDescription>
                    {t("settings.colorThemeDescription")}
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
                        <span className="text-xs">
                          {t(`settings.colorThemes.${colorScheme.name}`)}
                        </span>
                      </Button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {t("settings.themePreferencesSaved")}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t("settings.notificationSettings")}
                  </CardTitle>
                  <CardDescription>
                    {t("settings.notificationSettingsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {t("settings.taskNotifications")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("settings.taskNotificationsDescription")}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={
                          loadingPreferences ? true : receiveTaskNotifications
                        }
                        onCheckedChange={(checked) =>
                          handleNotificationPreferenceChange("task", checked)
                        }
                        disabled={saving || loadingPreferences}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                          <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {t("settings.eventNotifications")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("settings.eventNotificationsDescription")}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={
                          loadingPreferences ? true : receiveEventNotifications
                        }
                        onCheckedChange={(checked) =>
                          handleNotificationPreferenceChange("event", checked)
                        }
                        disabled={saving || loadingPreferences}
                      />
                    </div>
                  </div>

                  {saving && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("settings.savingPreferences")}
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">
                          {t("settings.notificationTypes")}
                        </p>
                        <p>{t("settings.notificationTypesDescription")}</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>
                            {t("settings.notificationTypesList.tasksDue")}
                          </li>
                          <li>
                            {t("settings.notificationTypesList.eventsStarting")}
                          </li>
                          <li>
                            {t(
                              "settings.notificationTypesList.updatesReminders"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="language" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.language")}</CardTitle>
                  <CardDescription>
                    {t("settings.languageDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LanguageSwitch />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">
                    {t("settings.exportData")}
                  </CardTitle>
                  <CardDescription>
                    {t("settings.exportDataDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleExportData}
                    disabled={exportingData}
                    className="w-full sm:w-auto"
                  >
                    {exportingData ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {exportingData
                      ? t("settings.exportDataExporting")
                      : t("settings.exportDataButton")}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    {t("settings.deleteAccount")}
                  </CardTitle>
                  <CardDescription>
                    {t("settings.deleteAccountDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive">
                      {t("settings.deleteAccountWarning")}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="confirm-delete"
                      checked={confirmDelete}
                      onCheckedChange={(checked) =>
                        setConfirmDelete(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="confirm-delete"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("settings.deleteAccountConfirm")}
                    </label>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={!confirmDelete || deletingAccount}
                        className="w-full sm:w-auto"
                      >
                        {deletingAccount ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        {deletingAccount
                          ? t("settings.deleteAccountDialogDeleting")
                          : t("settings.deleteAccountButton")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("settings.deleteAccountDialogTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("settings.deleteAccountDialogDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("settings.deleteAccountDialogCancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingAccount
                            ? t("settings.deleteAccountDialogDeleting")
                            : t("settings.deleteAccountDialogDelete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
