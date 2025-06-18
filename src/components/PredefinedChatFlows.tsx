import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Settings,
  Bot,
  User,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "action" | "question" | "condition";
  options?: string[];
  nextStep?: string;
  delay?: number;
}

interface ChatFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  category: string;
  messages: ChatMessage[];
  isActive: boolean;
  completionRate: number;
  avgDuration: string;
}

interface PredefinedChatFlowsProps {
  onFlowSelect?: (flow: ChatFlow) => void;
  selectedFlowId?: string;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const PredefinedChatFlows: React.FC<PredefinedChatFlowsProps> = ({
  onFlowSelect = () => {},
  selectedFlowId = "",
  isPlaying = false,
  onPlayStateChange = () => {},
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock predefined chat flows
  const chatFlows: ChatFlow[] = [
    {
      id: "onboarding",
      name: "User Onboarding",
      description: "Welcome new users and guide them through account setup",
      trigger: "welcome",
      category: "Onboarding",
      isActive: true,
      completionRate: 89,
      avgDuration: "3m 45s",
      messages: [
        {
          id: "1",
          content:
            "Welcome! I'm here to help you get started. What brings you here today?",
          sender: "assistant",
          timestamp: new Date(),
          type: "question",
          options: ["Create an account", "Learn about features", "Get support"],
          delay: 1000,
        },
        {
          id: "2",
          content:
            "Great choice! Let me guide you through creating your account step by step.",
          sender: "assistant",
          timestamp: new Date(),
          type: "text",
          delay: 1500,
        },
        {
          id: "3",
          content:
            "First, let's start with your basic information. I'll help you fill out each field.",
          sender: "assistant",
          timestamp: new Date(),
          type: "action",
          delay: 2000,
        },
      ],
    },
    {
      id: "form-assistance",
      name: "Form Completion Help",
      description: "Assist users with filling out complex forms",
      trigger: "form help",
      category: "Support",
      isActive: true,
      completionRate: 94,
      avgDuration: "2m 30s",
      messages: [
        {
          id: "1",
          content:
            "I see you're working on a form. I can help you complete it quickly and accurately!",
          sender: "assistant",
          timestamp: new Date(),
          type: "text",
          delay: 800,
        },
        {
          id: "2",
          content: "Which section would you like help with?",
          sender: "assistant",
          timestamp: new Date(),
          type: "question",
          options: [
            "Personal Information",
            "Address Details",
            "Payment Info",
            "Review & Submit",
          ],
          delay: 1200,
        },
        {
          id: "3",
          content:
            "Perfect! Let me highlight the required fields and provide guidance for each one.",
          sender: "assistant",
          timestamp: new Date(),
          type: "action",
          delay: 1800,
        },
      ],
    },
    {
      id: "language-support",
      name: "Language Selection",
      description: "Help users choose their preferred language",
      trigger: "language",
      category: "Accessibility",
      isActive: true,
      completionRate: 96,
      avgDuration: "1m 15s",
      messages: [
        {
          id: "1",
          content:
            "I can communicate in multiple languages. What's your preferred language?",
          sender: "assistant",
          timestamp: new Date(),
          type: "question",
          options: [
            "English",
            "Español",
            "Français",
            "Deutsch",
            "中文",
            "العربية",
          ],
          delay: 1000,
        },
        {
          id: "2",
          content:
            "Excellent! I'll switch to your preferred language and help you navigate in a way that feels natural.",
          sender: "assistant",
          timestamp: new Date(),
          type: "text",
          delay: 1500,
        },
      ],
    },
    {
      id: "troubleshooting",
      name: "Technical Support",
      description: "Help users resolve common technical issues",
      trigger: "help",
      category: "Support",
      isActive: true,
      completionRate: 78,
      avgDuration: "4m 20s",
      messages: [
        {
          id: "1",
          content:
            "I'm here to help resolve any issues you're experiencing. What seems to be the problem?",
          sender: "assistant",
          timestamp: new Date(),
          type: "question",
          options: [
            "Page won't load",
            "Form not submitting",
            "Login issues",
            "Other",
          ],
          delay: 1000,
        },
        {
          id: "2",
          content:
            "Let me run through some quick diagnostics and provide you with a solution.",
          sender: "assistant",
          timestamp: new Date(),
          type: "action",
          delay: 2000,
        },
      ],
    },
  ];

  const selectedFlow = chatFlows.find((flow) => flow.id === selectedFlowId);

  // Reset when flow changes
  useEffect(() => {
    if (selectedFlow) {
      setCurrentMessageIndex(0);
      setDisplayedMessages([]);
      setIsTyping(false);
    }
  }, [selectedFlowId]);

  // Handle flow playback
  useEffect(() => {
    if (!isPlaying || !selectedFlow) return;

    if (currentMessageIndex >= selectedFlow.messages.length) {
      onPlayStateChange(false);
      return;
    }

    const currentMessage = selectedFlow.messages[currentMessageIndex];
    const delay = currentMessage.delay || 1000;

    setIsTyping(true);

    const timer = setTimeout(() => {
      setDisplayedMessages((prev) => [...prev, currentMessage]);
      setIsTyping(false);
      setCurrentMessageIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentMessageIndex, selectedFlow, onPlayStateChange]);

  const handlePlayPause = () => {
    onPlayStateChange(!isPlaying);
  };

  const handleReset = () => {
    setCurrentMessageIndex(0);
    setDisplayedMessages([]);
    setIsTyping(false);
    onPlayStateChange(false);
  };

  const handleSkip = () => {
    if (selectedFlow && currentMessageIndex < selectedFlow.messages.length) {
      const nextMessage = selectedFlow.messages[currentMessageIndex];
      setDisplayedMessages((prev) => [...prev, nextMessage]);
      setCurrentMessageIndex((prev) => prev + 1);
      setIsTyping(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Onboarding":
        return "bg-green-100 text-green-800";
      case "Support":
        return "bg-blue-100 text-blue-800";
      case "Accessibility":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Predefined Chat Flows
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage conversation templates for common user scenarios
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Flow Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flow List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Flows</CardTitle>
              <CardDescription>
                Select a flow to preview or test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {chatFlows.map((flow) => (
                <motion.div
                  key={flow.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedFlowId === flow.id
                      ? "border-purple-200 bg-purple-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => onFlowSelect(flow)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{flow.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {flow.description}
                      </p>
                    </div>
                    <Badge
                      className={getCategoryColor(flow.category)}
                      variant="secondary"
                    >
                      {flow.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {flow.messages.length}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {flow.avgDuration}
                      </span>
                    </div>
                    <span
                      className={`font-medium ${getCompletionColor(flow.completionRate)}`}
                    >
                      {flow.completionRate}%
                    </span>
                  </div>

                  <div className="mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Trigger: {flow.trigger}
                    </code>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Flow Preview */}
        <div className="lg:col-span-2 space-y-4">
          {selectedFlow ? (
            <>
              {/* Flow Controls */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                        <span>{selectedFlow.name}</span>
                      </CardTitle>
                      <CardDescription>
                        {selectedFlow.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={displayedMessages.length === 0}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSkip}
                        disabled={
                          !isPlaying ||
                          currentMessageIndex >= selectedFlow.messages.length
                        }
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handlePlayPause}
                        className={
                          isPlaying
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Play Flow
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Chat Preview */}
              <Card className="h-[500px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Flow Preview</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {displayedMessages.length} /{" "}
                        {selectedFlow.messages.length}
                      </Badge>
                      {isPlaying && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 bg-green-500 rounded-full"
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <AnimatePresence>
                        {displayedMessages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-start space-x-3 ${
                              message.sender === "user"
                                ? "flex-row-reverse space-x-reverse"
                                : ""
                            }`}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              {message.sender === "user" ? (
                                <>
                                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                                  <AvatarFallback>
                                    <User className="h-4 w-4" />
                                  </AvatarFallback>
                                </>
                              ) : (
                                <>
                                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=assistant" />
                                  <AvatarFallback>
                                    <Bot className="h-4 w-4" />
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div
                              className={`flex-1 max-w-xs ${message.sender === "user" ? "text-right" : ""}`}
                            >
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  message.sender === "user"
                                    ? "bg-purple-600 text-white"
                                    : message.type === "question"
                                      ? "bg-blue-50 border border-blue-200"
                                      : message.type === "action"
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-gray-100"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>

                                {/* Message Type Indicator */}
                                {message.type &&
                                  message.sender === "assistant" && (
                                    <div className="flex items-center mt-2 text-xs opacity-70">
                                      {message.type === "question" && (
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                      )}
                                      {message.type === "action" && (
                                        <Zap className="h-3 w-3 mr-1" />
                                      )}
                                      {message.type === "condition" && (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      )}
                                      <span className="capitalize">
                                        {message.type}
                                      </span>
                                    </div>
                                  )}

                                {/* Options for questions */}
                                {message.options &&
                                  message.options.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {message.options.map(
                                        (option, optionIndex) => (
                                          <button
                                            key={optionIndex}
                                            className="block w-full text-left text-xs bg-white rounded px-2 py-1 border border-gray-200 hover:bg-gray-50 transition-colors"
                                          >
                                            {option}
                                          </button>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start space-x-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=assistant" />
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Chat Flow
                </h3>
                <p className="text-gray-500">
                  Choose a predefined flow from the list to preview its
                  conversation
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredefinedChatFlows;
