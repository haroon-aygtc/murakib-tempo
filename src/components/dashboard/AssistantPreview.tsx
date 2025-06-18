import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code,
  Share,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import DemoForm from "@/components/DemoForm";

const AssistantPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("desktop");
  const [selectedAssistant, setSelectedAssistant] =
    useState("customer-support");

  const assistants = [
    {
      id: "customer-support",
      name: "Customer Support Bot",
      description: "Helps customers with common inquiries",
      status: "active",
    },
    {
      id: "multilingual-guide",
      name: "Multilingual Guide",
      description: "Provides guidance in multiple languages",
      status: "active",
    },
    {
      id: "form-assistant",
      name: "Form Assistant",
      description: "Helps users fill out complex forms",
      status: "draft",
    },
  ];

  const getDeviceStyles = () => {
    switch (selectedDevice) {
      case "tablet":
        return "max-w-2xl mx-auto";
      case "mobile":
        return "max-w-sm mx-auto";
      default:
        return "w-full";
    }
  };

  const getDeviceIcon = () => {
    switch (selectedDevice) {
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Assistant Preview
          </h1>
          <p className="text-gray-600 mt-1">
            Test and preview your AI assistants in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview Controls</CardTitle>
          <CardDescription>
            Configure the preview settings and test different scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Assistant
              </label>
              <Select
                value={selectedAssistant}
                onValueChange={setSelectedAssistant}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assistants.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      <div className="flex items-center space-x-2">
                        <span>{assistant.name}</span>
                        <Badge
                          variant={
                            assistant.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {assistant.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Device</label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4" />
                      <span>Desktop</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="tablet">
                    <div className="flex items-center space-x-2">
                      <Tablet className="h-4 w-4" />
                      <span>Tablet</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Mobile</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className={
                  isPlaying
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Tabs */}
      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Live Preview</span>
          </TabsTrigger>
          <TabsTrigger value="embed" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Embed Code</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {/* Device Frame */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getDeviceIcon()}
                  <span className="font-medium capitalize">
                    {selectedDevice} Preview
                  </span>
                </div>
                <Badge variant="outline">
                  {assistants.find((a) => a.id === selectedAssistant)?.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4">
                <motion.div
                  className={`bg-white rounded-lg shadow-lg overflow-hidden ${getDeviceStyles()}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Mock Browser Header */}
                  <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2 border-b">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                      https://example.com/demo
                    </div>
                  </div>

                  {/* Demo Content */}
                  <div className="relative">
                    <DemoForm />
                    {isPlaying && <AIAssistantWidget />}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    4.8/5
                  </div>
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="embed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>
                Copy and paste this code into your website to embed the AI
                assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`<!-- Murakib AI Assistant Widget -->
<script src="https://cdn.murakib.com/widget.js"></script>
<script>
  MurakibWidget.init({
    assistantId: '${selectedAssistant}',
    apiKey: 'your-api-key-here',
    position: 'bottom-right',
    theme: 'light',
    language: 'auto'
  });
</script>`}</pre>
                </div>
                <div className="flex space-x-2">
                  <Button>
                    <Code className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssistantPreview;
