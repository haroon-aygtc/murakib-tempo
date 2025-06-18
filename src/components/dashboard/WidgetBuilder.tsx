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
import AIAssistantWidget from "@/components/AIAssistantWidget";
import { useWidgetConfig } from "@/contexts/WidgetConfigContext";
import AIProviderConfig from "@/components/dashboard/AIProviderConfig";
import LivePreview from "@/components/dashboard/LivePreview";
import LanguageSelector from "@/components/LanguageSelector";

const WidgetBuilder = () => {
  const { toast } = useToast();
  const { config, updateConfig, resetConfig, saveConfig, isLoading, isDirty } =
    useWidgetConfig();

  const handleSave = async () => {
    try {
      await saveConfig();
      toast({
        title: "Success",
        description: "Widget configuration saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save widget configuration",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    resetConfig();
    toast({
      title: "Reset Complete",
      description: "Widget configuration has been reset to defaults",
    });
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Widget Builder</h1>
          <p className="text-muted-foreground mt-1">
            Customize your AI assistant widget appearance and behavior
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !isDirty}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
        {/* Configuration Panel */}
        <div className="xl:col-span-2 space-y-6 w-full">
          <Tabs defaultValue="appearance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
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
                value="ai-config"
                className="flex items-center space-x-1"
              >
                <Wand2 className="h-4 w-4" />
                <span className="hidden sm:inline">AI Config</span>
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
                        value={config.name}
                        onChange={(e) => updateConfig("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={config.avatar}
                        onChange={(e) => updateConfig("avatar", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) =>
                        updateConfig("description", e.target.value)
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
                          value={config.primaryColor}
                          onChange={(e) =>
                            updateConfig("primaryColor", e.target.value)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={config.primaryColor}
                          onChange={(e) =>
                            updateConfig("primaryColor", e.target.value)
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
                          value={config.secondaryColor}
                          onChange={(e) =>
                            updateConfig("secondaryColor", e.target.value)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={config.secondaryColor}
                          onChange={(e) =>
                            updateConfig("secondaryColor", e.target.value)
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
                        value={config.position}
                        onValueChange={(value) =>
                          updateConfig("position", value)
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
                        value={config.size}
                        onValueChange={(value) => updateConfig("size", value)}
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

            <TabsContent value="ai-config" className="space-y-4">
              <AIProviderConfig />
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
                      value={config.welcomeMessage}
                      onChange={(e) =>
                        updateConfig("welcomeMessage", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Personality</Label>
                    <Select
                      value={config.personality}
                      onValueChange={(value) =>
                        updateConfig("personality", value)
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
                      value={[config.responseDelay]}
                      onValueChange={(value) =>
                        updateConfig("responseDelay", value[0])
                      }
                      max={3000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">
                      {config.responseDelay}ms
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Chat Interface</Label>
                        <div className="text-sm text-muted-foreground">
                          Enable text-based chat
                        </div>
                      </div>
                      <Switch
                        checked={config.chatEnabled}
                        onCheckedChange={(checked) =>
                          updateConfig("chatEnabled", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Form Guidance</Label>
                        <div className="text-sm text-muted-foreground">
                          Provide contextual form help
                        </div>
                      </div>
                      <Switch
                        checked={config.formGuidanceEnabled}
                        onCheckedChange={(checked) =>
                          updateConfig("formGuidanceEnabled", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Highlight Mode</Label>
                    <Select
                      value={config.highlightMode}
                      onValueChange={(value) =>
                        updateConfig("highlightMode", value)
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
                      <div className="text-sm text-muted-foreground">
                        Enable voice input and output
                      </div>
                    </div>
                    <Switch
                      checked={config.voiceEnabled}
                      onCheckedChange={(checked) =>
                        updateConfig("voiceEnabled", checked)
                      }
                    />
                  </div>

                  {config.voiceEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Voice Model</Label>
                        <Select
                          value={config.voiceModel}
                          onValueChange={(value) =>
                            updateConfig("voiceModel", value)
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
                              <div className="text-sm text-muted-foreground">
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
                              <div className="text-sm text-muted-foreground">
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
                    <LanguageSelector
                      selectedLanguage={config.language}
                      onLanguageChange={(value) =>
                        updateConfig("language", value)
                      }
                      variant="select"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center space-x-2">
                        <Languages className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Auto-Detection</div>
                          <div className="text-sm text-muted-foreground">
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
                          <div className="text-sm text-muted-foreground">
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
          <LivePreview />
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
