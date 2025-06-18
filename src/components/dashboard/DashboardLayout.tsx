import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  LayoutDashboard,
  Wand2,
  BookOpen,
  Eye,
  Globe,
  MessageSquare,
  BarChart3,
  Rocket,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigation = [
    {
      name: "Assistants",
      href: "/dashboard/assistants",
      icon: LayoutDashboard,
      current:
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/assistants",
    },
    {
      name: "Widget Builder",
      href: "/dashboard/widget-builder",
      icon: Wand2,
      current: location.pathname === "/dashboard/widget-builder",
      badge: "New",
    },
    {
      name: "Tutorial Builder",
      href: "/dashboard/tutorial-builder",
      icon: BookOpen,
      current: location.pathname === "/dashboard/tutorial-builder",
    },
    {
      name: "Preview",
      href: "/dashboard/preview",
      icon: Eye,
      current: location.pathname === "/dashboard/preview",
    },
    {
      name: "Languages",
      href: "/dashboard/languages",
      icon: Globe,
      current: location.pathname === "/dashboard/languages",
    },
    {
      name: "AI Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      current: location.pathname === "/dashboard/chat",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      current: location.pathname === "/dashboard/analytics",
    },
    {
      name: "Deploy",
      href: "/dashboard/deploy",
      icon: Rocket,
      current: location.pathname === "/dashboard/deploy",
    },
    {
      name: "Knowledge Base",
      href: "/dashboard/knowledge",
      icon: BookOpen,
      current: location.pathname === "/dashboard/knowledge",
    },
    {
      name: "Chat Flows",
      href: "/dashboard/flows",
      icon: MessageSquare,
      current: location.pathname === "/dashboard/flows",
    },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/auth/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6 border-b border-border/50">
        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gradient">Murakib</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                item.current
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    item.current
                      ? "text-primary scale-110"
                      : "text-muted-foreground group-hover:text-foreground group-hover:scale-105",
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary border-primary/20 animate-pulse"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto rounded-xl hover:bg-accent/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    DU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">
                    Demo User
                  </p>
                  <p className="text-xs text-muted-foreground">
                    demo@murakib.com
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:rotate-180" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow glass border-r border-border/20 shadow-2xl">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 glass">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 glass border-b border-border/20 shadow-lg">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden hover:bg-accent/50"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 glass">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-background/60 border-border/40 focus:border-primary/40 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent/50 transition-all duration-300"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-accent/50 transition-all duration-300"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        DU
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Demo User
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        demo@murakib.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="bg-background min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="animate-fade-in px-4 py-6 sm:px-6 lg:px-8 max-w-none"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
