import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Upload,
  Download,
  BookOpen,
  FileText,
  Link,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: "faq" | "guide" | "policy" | "custom";
  tags: string[];
  category: string;
  isActive: boolean;
  lastUpdated: string;
  usage: number;
}

interface CustomFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: FlowStep[];
  isActive: boolean;
}

interface FlowStep {
  id: string;
  type: "message" | "question" | "action" | "condition";
  content: string;
  options?: string[];
  nextStep?: string;
}

const KnowledgeBaseManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddFlowOpen, setIsAddFlowOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: "",
    content: "",
    type: "faq" as const,
    tags: "",
    category: "",
  });

  const [newFlow, setNewFlow] = useState({
    name: "",
    description: "",
    trigger: "",
  });

  // Mock data
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      title: "How to reset password?",
      content:
        "To reset your password, click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
      type: "faq",
      tags: ["password", "login", "security"],
      category: "Authentication",
      isActive: true,
      lastUpdated: "2024-01-15",
      usage: 245,
    },
    {
      id: "2",
      title: "Form Submission Guidelines",
      content:
        "When submitting forms, ensure all required fields are filled. Use the format validation hints provided for each field type.",
      type: "guide",
      tags: ["forms", "validation", "submission"],
      category: "Forms",
      isActive: true,
      lastUpdated: "2024-01-14",
      usage: 189,
    },
    {
      id: "3",
      title: "Privacy Policy Summary",
      content:
        "We collect minimal data necessary for service functionality. Your data is encrypted and never shared with third parties without consent.",
      type: "policy",
      tags: ["privacy", "data", "security"],
      category: "Legal",
      isActive: true,
      lastUpdated: "2024-01-10",
      usage: 156,
    },
  ]);

  const [customFlows, setCustomFlows] = useState<CustomFlow[]>([
    {
      id: "1",
      name: "Account Setup Flow",
      description: "Guides new users through account creation process",
      trigger: "account setup",
      isActive: true,
      steps: [
        {
          id: "1",
          type: "message",
          content:
            "Welcome! I'll help you set up your account. Let's start with your basic information.",
        },
        {
          id: "2",
          type: "question",
          content: "What type of account would you like to create?",
          options: ["Personal", "Business", "Enterprise"],
          nextStep: "3",
        },
        {
          id: "3",
          type: "action",
          content: "Great! Now let's fill out your profile information.",
        },
      ],
    },
  ]);

  const categories = [
    "all",
    "Authentication",
    "Forms",
    "Legal",
    "Support",
    "Billing",
  ];

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (!newItem.title || !newItem.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const item: KnowledgeItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      type: newItem.type,
      tags: newItem.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category: newItem.category || "General",
      isActive: true,
      lastUpdated: new Date().toISOString().split("T")[0],
      usage: 0,
    };

    setKnowledgeItems([...knowledgeItems, item]);
    setNewItem({ title: "", content: "", type: "faq", tags: "", category: "" });
    setIsAddItemOpen(false);

    toast({
      title: "Success",
      description: "Knowledge item added successfully",
    });
  };

  const handleDeleteItem = (id: string) => {
    setKnowledgeItems(knowledgeItems.filter((item) => item.id !== id));
    toast({
      title: "Success",
      description: "Knowledge item deleted successfully",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "faq":
        return <BookOpen className="h-4 w-4" />;
      case "guide":
        return <FileText className="h-4 w-4" />;
      case "policy":
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "faq":
        return "bg-blue-100 text-blue-800";
      case "guide":
        return "bg-green-100 text-green-800";
      case "policy":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-1">
            Manage your AI assistant's knowledge base and custom conversation
            flows
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Knowledge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Knowledge Item</DialogTitle>
                <DialogDescription>
                  Add new information to your AI assistant's knowledge base
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter knowledge item title"
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem({ ...newItem, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the knowledge content"
                    value={newItem.content}
                    onChange={(e) =>
                      setNewItem({ ...newItem, content: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value: any) =>
                        setNewItem({ ...newItem, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faq">FAQ</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Authentication"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="password, login, security"
                    value={newItem.tags}
                    onChange={(e) =>
                      setNewItem({ ...newItem, tags: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Items</TabsTrigger>
          <TabsTrigger value="flows">Custom Flows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Items
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {knowledgeItems.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Items
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {knowledgeItems.filter((item) => item.isActive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Tag className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Categories
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        new Set(knowledgeItems.map((item) => item.category))
                          .size
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Usage
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {knowledgeItems.reduce(
                        (sum, item) => sum + item.usage,
                        0,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(item.type)}
                        <Badge className={getTypeColor(item.type)}>
                          {item.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {item.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {item.content}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Used {item.usage} times</span>
                      <span>Updated {item.lastUpdated}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Custom Conversation Flows</h3>
              <p className="text-sm text-gray-600">
                Create predefined conversation paths for common scenarios
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Flow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customFlows.map((flow) => (
              <Card
                key={flow.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <CardDescription>{flow.description}</CardDescription>
                    </div>
                    <Badge variant={flow.isActive ? "default" : "secondary"}>
                      {flow.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Trigger:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {flow.trigger}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Steps:</span>
                      <span className="font-medium">{flow.steps.length}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Test Flow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Knowledge Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {knowledgeItems
                    .sort((a, b) => b.usage - a.usage)
                    .slice(0, 5)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                        </div>
                        <Badge variant="outline">{item.usage} uses</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Coverage Rate:
                    </span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Accuracy Score:
                    </span>
                    <span className="font-medium text-blue-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Response Time:
                    </span>
                    <span className="font-medium text-purple-600">0.8s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      User Satisfaction:
                    </span>
                    <span className="font-medium text-orange-600">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBaseManager;
