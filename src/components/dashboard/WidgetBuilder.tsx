import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Bot,
  Volume2,
  Globe,
  Settings,
  Eye,
  Save,
  RotateCcw,
  Wand2,
  MessageSquare,
  Mic,
  Languages,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const WidgetBuilder = () => {
  const { toast } = useToast();
  const [widgetConfig, setWidgetConfig] = useState({
    name: "Customer Support Assistant",
    description: "Helps customers with inquiries and support",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
    primaryColor: "#8B5CF6",
    secondaryColor: "#3B82F6",
    position: "bottom-right",
    size: "medium",
    language: "en",
    voiceEnabled: true,
    voiceModel: "elevenlabs-nova",
    chatEnabled: true,
    formGuidanceEnabled: true,
    highlightMode: "subtle",
    welcomeMessage: "Hi! I'm here to help you. How can I assist you today?",
    personality: "friendly",
    responseDelay: 1000,
  });

  const handleConfigChange = (key: string, value: any) => {
    setWidgetConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Widget configuration saved successfully",
    });
  };

  const handleReset = () => {
    setWidgetConfig({
      name: "Customer Support Assistant",
      description: "Helps customers with inquiries and support",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
      primaryColor: "#8B5CF6",
      secondaryColor: "#3B82F6",
      position: "bottom-right",
      size: "medium",
      language: "en",
      voiceEnabled: true,
      voiceModel: "elevenlabs-nova",
      chatEnabled: true,
      formGuidanceEnabled: true,
      highlightMode: "subtle",
      welcomeMessage: "Hi! I'm here to help you. How can I assist you today?",
      personality: "friendly",
      responseDelay: 1000,
    });
    toast({
      title: "Reset Complete",
      description: "Widget configuration has been reset to defaults",
    });
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Widget Builder</h1>
          <p className="text-gray-600 mt-1">
            Customize your AI assistant widget appearance and behavior
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="appearance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="appearance"
                className="flex items-center space-x-1"
              >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger
                value="behavior"
                className="flex items-center space-x-1"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Behavior</span>
              </TabsTrigger>
              <TabsTrigger
                value="voice"
                className="flex items-center space-x-1"
              >
                <Volume2 className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger
                value="language"
                className="flex items-center space-x-1"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Language</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Assistant Name</Label>
                      <Input
                        id="name"
                        value={widgetConfig.name}
                        onChange={(e) =>
                          handleConfigChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={widgetConfig.avatar}
                        onChange={(e) =>
                          handleConfigChange("avatar", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={widgetConfig.description}
                      onChange={(e) =>
                        handleConfigChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={widgetConfig.primaryColor}
                          onChange={(e) =>
                            handleConfigChange("primaryColor", e.target.value)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={widgetConfig.primaryColor}
                          onChange={(e) =>
                            handleConfigChange("primaryColor", e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={widgetConfig.secondaryColor}
                          onChange={(e) =>
                            handleConfigChange("secondaryColor", e.target.value)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={widgetConfig.secondaryColor}
                          onChange={(e) =>
                            handleConfigChange("secondaryColor", e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Select
                        value={widgetConfig.position}
                        onValueChange={(value) =>
                          handleConfigChange("position", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">
                            Bottom Right
                          </SelectItem>
                          <SelectItem value="bottom-left">
                            Bottom Left
                          </SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Size</Label>
                      <Select
                        value={widgetConfig.size}
                        onValueChange={(value) =>
                          handleConfigChange("size", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assistant Behavior</CardTitle>
                  <CardDescription>
                    Configure how your assistant interacts with users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={widgetConfig.welcomeMessage}
                      onChange={(e) =>
                        handleConfigChange("welcomeMessage", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Personality</Label>
                    <Select
                      value={widgetConfig.personality}
                      onValueChange={(value) =>
                        handleConfigChange("personality", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Response Delay (ms)</Label>
                    <Slider
                      value={[widgetConfig.responseDelay]}
                      onValueChange={(value) =>
                        handleConfigChange("responseDelay", value[0])
                      }
                      max={3000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">
                      {widgetConfig.responseDelay}ms
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Chat Interface</Label>
                        <div className="text-sm text-gray-500">
                          Enable text-based chat
                        </div>
                      </div>
                      <Switch
                        checked={widgetConfig.chatEnabled}
                        onCheckedChange={(checked) =>
                          handleConfigChange("chatEnabled", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Form Guidance</Label>
                        <div className="text-sm text-gray-500">
                          Provide contextual form help
                        </div>
                      </div>
                      <Switch
                        checked={widgetConfig.formGuidanceEnabled}
                        onCheckedChange={(checked) =>
                          handleConfigChange("formGuidanceEnabled", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Highlight Mode</Label>
                    <Select
                      value={widgetConfig.highlightMode}
                      onValueChange={(value) =>
                        handleConfigChange("highlightMode", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subtle">Subtle</SelectItem>
                        <SelectItem value="prominent">Prominent</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Settings</CardTitle>
                  <CardDescription>
                    Configure text-to-speech and voice interaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Voice Interface</Label>
                      <div className="text-sm text-gray-500">
                        Enable voice input and output
                      </div>
                    </div>
                    <Switch
                      checked={widgetConfig.voiceEnabled}
                      onCheckedChange={(checked) =>
                        handleConfigChange("voiceEnabled", checked)
                      }
                    />
                  </div>

                  {widgetConfig.voiceEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Voice Model</Label>
                        <Select
                          value={widgetConfig.voiceModel}
                          onValueChange={(value) =>
                            handleConfigChange("voiceModel", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="elevenlabs-nova">
                              ElevenLabs Nova (Premium)
                            </SelectItem>
                            <SelectItem value="elevenlabs-alloy">
                              ElevenLabs Alloy
                            </SelectItem>
                            <SelectItem value="google-standard">
                              Google Standard
                            </SelectItem>
                            <SelectItem value="google-wavenet">
                              Google WaveNet
                            </SelectItem>
                            <SelectItem value="openai-tts">
                              OpenAI TTS
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center space-x-2">
                            <Mic className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Speech-to-Text</div>
                              <div className="text-sm text-gray-500">
                                Voice input
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="flex items-center space-x-2">
                            <Volume2 className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">Text-to-Speech</div>
                              <div className="text-sm text-gray-500">
                                Voice output
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="language" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Language & Localization</CardTitle>
                  <CardDescription>
                    Configure language support and translation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Language</Label>
                    <Select
                      value={widgetConfig.language}
                      onValueChange={(value) =>
                        handleConfigChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center space-x-2">
                        <Languages className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Auto-Detection</div>
                          <div className="text-sm text-gray-500">
                            Detect user language
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">
                            Real-time Translation
                          </div>
                          <div className="text-sm text-gray-500">
                            Translate responses
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label>Supported Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "English",
                        "Spanish",
                        "French",
                        "German",
                        "Italian",
                        "Portuguese",
                        "Chinese",
                        "Japanese",
                      ].map((lang) => (
                        <Badge key={lang} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Live Preview</span>
              </CardTitle>
              <CardDescription>
                See how your widget will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] relative">
                {/* Mock Website Background */}
                <div className="bg-white rounded shadow-sm p-4 mb-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                {/* Widget Preview */}
                <div
                  className={`absolute ${
                    widgetConfig.position === "bottom-right"
                      ? "bottom-4 right-4"
                      : widgetConfig.position === "bottom-left"
                        ? "bottom-4 left-4"
                        : widgetConfig.position === "top-right"
                          ? "top-4 right-4"
                          : "top-4 left-4"
                  }`}
                >
                  <motion.div
                    className={`bg-white rounded-full shadow-lg cursor-pointer flex items-center justify-center ${
                      widgetConfig.size === "small"
                        ? "w-12 h-12"
                        : widgetConfig.size === "large"
                          ? "w-16 h-16"
                          : "w-14 h-14"
                    }`}
                    style={{ backgroundColor: widgetConfig.primaryColor }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Avatar
                      className={
                        widgetConfig.size === "small"
                          ? "w-8 h-8"
                          : widgetConfig.size === "large"
                            ? "w-12 h-12"
                            : "w-10 h-10"
                      }
                    >
                      <AvatarImage src={widgetConfig.avatar} />
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{widgetConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Position:</span>
                <span className="font-medium capitalize">
                  {widgetConfig.position.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium capitalize">
                  {widgetConfig.size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="font-medium">
                  {widgetConfig.language.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Voice:</span>
                <span className="font-medium">
                  {widgetConfig.voiceEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chat:</span>
                <span className="font-medium">
                  {widgetConfig.chatEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
