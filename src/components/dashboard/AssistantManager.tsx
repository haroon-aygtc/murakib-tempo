import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Bot,
  Globe,
  MessageSquare,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar: string;
  language: string;
  status: "active" | "inactive" | "draft";
  interactions: number;
  lastModified: string;
  createdAt: string;
}

const AssistantManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssistant, setNewAssistant] = useState({
    name: "",
    description: "",
    language: "en",
  });

  // Mock data
  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      id: "1",
      name: "Customer Support Bot",
      description: "Helps customers with common inquiries and support tickets",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=support",
      language: "English",
      status: "active",
      interactions: 1247,
      lastModified: "2 hours ago",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Multilingual Guide",
      description:
        "Provides guidance in multiple languages for international users",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guide",
      language: "Multi",
      status: "active",
      interactions: 892,
      lastModified: "1 day ago",
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Form Assistant",
      description:
        "Helps users fill out complex forms with contextual guidance",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=form",
      language: "English",
      status: "draft",
      interactions: 0,
      lastModified: "3 days ago",
      createdAt: "2024-01-08",
    },
  ]);

  const filteredAssistants = assistants.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateAssistant = () => {
    if (!newAssistant.name.trim()) {
      toast({
        title: "Error",
        description: "Assistant name is required",
        variant: "destructive",
      });
      return;
    }

    const assistant: Assistant = {
      id: Date.now().toString(),
      name: newAssistant.name,
      description: newAssistant.description,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAssistant.name}`,
      language: newAssistant.language === "en" ? "English" : "Multi",
      status: "draft",
      interactions: 0,
      lastModified: "Just now",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAssistants([assistant, ...assistants]);
    setNewAssistant({ name: "", description: "", language: "en" });
    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: "Assistant created successfully",
    });
  };

  const handleDeleteAssistant = (id: string) => {
    setAssistants(assistants.filter((a) => a.id !== id));
    toast({
      title: "Success",
      description: "Assistant deleted successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistants</h1>
          <p className="text-gray-600 mt-1">
            Manage your AI assistants and their configurations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Assistant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Assistant</DialogTitle>
              <DialogDescription>
                Set up a new AI assistant with custom configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter assistant name"
                  value={newAssistant.name}
                  onChange={(e) =>
                    setNewAssistant({ ...newAssistant, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this assistant does"
                  value={newAssistant.description}
                  onChange={(e) =>
                    setNewAssistant({
                      ...newAssistant,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Primary Language</Label>
                <Select
                  value={newAssistant.language}
                  onValueChange={(value) =>
                    setNewAssistant({ ...newAssistant, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="multi">Multilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAssistant}>Create Assistant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assistants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Assistants
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {assistants.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Interactions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {assistants.reduce((sum, a) => sum + a.interactions, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Assistants
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {assistants.filter((a) => a.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Languages</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assistants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssistants.map((assistant) => (
          <motion.div
            key={assistant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={assistant.avatar} />
                      <AvatarFallback>
                        {assistant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {assistant.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(assistant.status)}>
                          {assistant.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {assistant.language}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteAssistant(assistant.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {assistant.description}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {assistant.interactions}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {assistant.lastModified}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAssistants.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No assistants found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first AI assistant to get started"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Assistant
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AssistantManager;
