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
      <div className="flex items-center space-x-2 p-6 border-b border-white/10">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Murakib
        </span>
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
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                item.current
                  ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-700 border border-purple-200/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    item.current
                      ? "text-purple-600"
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-100 text-purple-700"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo" />
                  <AvatarFallback>DU</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Demo User</p>
                  <p className="text-xs text-gray-500">demo@murakib.com</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 bg-white/95 backdrop-blur-xl"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="p-0 w-72 bg-white/95 backdrop-blur-xl"
                >
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-white/60 border-white/20"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo" />
                      <AvatarFallback>DU</AvatarFallback>
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
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
