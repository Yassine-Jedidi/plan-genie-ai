import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  User,
  ChevronsUpDown,
  Calendar,
  Home,
  ClipboardList,
  Settings,
  LogOut,
  BarChart,
  ClipboardCheck,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";
import { ProfileDialog } from "@/components/profile-dialog";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useTranslation();

  // Menu items
  const items = [
    {
      title: t("sidebar.home"),
      url: "/home",
      icon: Home,
    },
    {
      title: t("sidebar.tasks"),
      url: "/tasks",
      icon: ClipboardList,
    },
    {
      title: t("sidebar.events"),
      url: "/events",
      icon: Calendar,
    },
    {
      title: t("sidebar.daily"),
      url: "/daily",
      icon: ClipboardCheck,
    },
    {
      title: t("sidebar.analytics"),
      url: "/analytics",
      icon: BarChart,
    },
    {
      title: t("sidebar.dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t("sidebar.signedOutSuccessfully"));
      navigate("/");
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error(t("sidebar.failedToSignOut"));
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setProfileDialogOpen(true);
    }, 100);
  };

  return (
    <>
      <Sidebar className="border-r border-r-primary/30 bg-card">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary">
              {t("sidebar.application")}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={`transition-all duration-200 hover:scale-105 ${
                          isActive
                            ? "bg-primary/30 text-primary/90 font-semibold border-l-4 border-primary/30"
                            : "hover:bg-primary/20"
                        }`}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between gap-3 h-12 hover:bg-primary/10 bg-card-foreground/5">
                  {loading ? (
                    <div className="flex items-center gap-2 w-full">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex flex-col items-start gap-1 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="User avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {user?.user_metadata?.full_name}
                        </span>
                        <span className="text-xs">{user?.email}</span>
                      </div>
                    </div>
                  )}
                  <ChevronsUpDown className="h-5 w-5 rounded-md shrink-0 text-primary" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {loading ? (
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <DropdownMenuSeparator />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="focus:bg-primary/20"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("sidebar.profile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="focus:bg-primary/20"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("sidebar.settings")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="focus:bg-primary/20"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("sidebar.logout")}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={(open) => {
          setProfileDialogOpen(open);
        }}
      />
    </>
  );
}
