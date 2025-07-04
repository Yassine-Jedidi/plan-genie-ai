import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LogOut,
  User,
  Settings,
  ClipboardList,
  Calendar,
  ClipboardCheck,
  Home,
  LayoutDashboard,
  BarChart,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AvatarButton() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t("avatar.signedOutSuccessfully"));
      navigate("/");
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error(t("avatar.failedToSignOut"));
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label={t("avatar.openAccountMenu")}
          >
            <User className="w-8 h-8 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64">
          <DropdownMenuLabel className="flex items-center gap-3">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user?.user_metadata?.avatar_url}
                alt="Avatar"
                width={32}
                height={32}
                className="shrink-0 rounded-full"
              />
            ) : (
              <User className="w-8 h-8 shrink-0 text-muted-foreground" />
            )}
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {user?.user_metadata?.full_name || t("avatar.anonymousUser")}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user?.user_metadata?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/home")}>
              <Home
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("avatar.home")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("avatar.settings")}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/tasks")}>
              <ClipboardList
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("avatar.tasks")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/events")}>
              <Calendar
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("avatar.events")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/daily")}>
              <ClipboardCheck
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("avatar.daily")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              <LayoutDashboard
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("avatar.dashboard")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/analytics")}>
              <BarChart
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("avatar.analytics")}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>{t("avatar.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export { AvatarButton };
