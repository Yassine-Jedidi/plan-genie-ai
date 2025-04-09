import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/sidebar";

import {
  User,
  ChevronsUpDown,
  Calendar,
  Home,
  ClipboardList,
  Settings,
  LogOut,
  LifeBuoy,
  BarChart,
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { nlpService, AnalysisResult } from "@/services/nlpService";
import { PromptInputWithActions } from "./components/input";

// Menu items
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "#",
    icon: ClipboardList,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart,
  },
  {
    title: "Help & Support",
    url: "#",
    icon: LifeBuoy,
  },
];

function HomePage() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const analyzeText = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setAnalyzing(true);
    try {
      const data = await nlpService.analyzeText(inputText);
      setResults(data);
      toast.success("Text analysis complete!");
    } catch (error) {
      console.error("Text analysis failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to analyze text. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
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
                            ? "bg-foreground/30 text-primary font-semibold"
                            : "hover:bg-foreground/20"
                        }`}
                      >
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between gap-3 h-12">
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
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-8 w-8" />
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {user?.user_metadata?.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  )}
                  <ChevronsUpDown className="h-5 w-5 rounded-md shrink-0" />
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
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 min-w-100vh">
        <div className="px-4 py-2">
          <SidebarTrigger className="h-4 w-4 mt-2" />
        </div>

        <div className="p-6 flex flex-col h-[calc(100vh-60px)]">
          <h1 className="text-2xl font-bold mb-6">Task Analysis</h1>

          <div className="grid gap-6 flex-grow overflow-auto">
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Task type detected with{" "}
                    {(results.confidence * 100).toFixed(2)}% confidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Task Type</h3>
                      <Badge className="mt-1" variant="secondary">
                        {results.type}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Entities</h3>
                      <div className="grid gap-2 mt-2">
                        {Object.entries(results.entities).length > 0 ? (
                          Object.entries(results.entities).map(
                            ([entityType, values]) => (
                              <div
                                key={entityType}
                                className="bg-muted/50 p-2 rounded-md"
                              >
                                <h4 className="font-medium">{entityType}</h4>
                                <ul className="list-disc list-inside">
                                  {Array.isArray(values) &&
                                    values.map((value, index) => (
                                      <li key={index} className="text-sm">
                                        {value}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No entities detected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => setResults(null)}
                    className="mr-2"
                  >
                    Clear Results
                  </Button>
                  <Button
                    onClick={() => {
                      // Here you could implement saving the task
                      toast.success("Task saved!");
                    }}
                  >
                    Save as Task
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="mt-4 sticky bottom-0 flex justify-center">
            <PromptInputWithActions
              onSubmit={analyzeText}
              value={inputText}
              onValueChange={setInputText}
              isLoading={analyzing}
              placeholder="Enter your task text here... e.g., 'I need to prepare a presentation for the marketing team by next Friday.'"
            />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default HomePage;
