import React, { createContext, useContext, useState, ReactNode } from "react";

export interface WidgetConfig {
  // Basic Settings
  name: string;
  description: string;
  avatar: string;

  // Appearance
  primaryColor: string;
  secondaryColor: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size: "small" | "medium" | "large";

  // Language & Localization
  language: string;
  supportedLanguages: string[];
  autoDetectLanguage: boolean;

  // Voice Settings
  voiceEnabled: boolean;
  voiceModel: string;
  speechToText: boolean;
  textToSpeech: boolean;

  // Features
  chatEnabled: boolean;
  formGuidanceEnabled: boolean;
  tutorialMode: boolean;
  highlightMode: "subtle" | "prominent" | "disabled";

  // AI Configuration
  aiProvider:
    | "openai"
    | "anthropic"
    | "google"
    | "azure"
    | "cohere"
    | "huggingface";
  aiModel: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;

  // Behavior
  welcomeMessage: string;
  personality: "friendly" | "professional" | "casual" | "formal";
  responseDelay: number;

  // Advanced
  customCSS: string;
  allowedDomains: string;
  analytics: boolean;
  autoUpdates: boolean;
}

interface WidgetConfigContextType {
  config: WidgetConfig;
  updateConfig: (key: keyof WidgetConfig, value: any) => void;
  updateMultipleConfig: (updates: Partial<WidgetConfig>) => void;
  resetConfig: () => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
  isDirty: boolean;
}

const defaultConfig: WidgetConfig = {
  // Basic Settings
  name: "AI Assistant",
  description: "Your helpful AI assistant",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",

  // Appearance
  primaryColor: "#8B5CF6",
  secondaryColor: "#3B82F6",
  position: "bottom-right",
  size: "medium",

  // Language & Localization
  language: "en",
  supportedLanguages: ["en", "es", "fr", "de"],
  autoDetectLanguage: true,

  // Voice Settings
  voiceEnabled: false,
  voiceModel: "elevenlabs-nova",
  speechToText: true,
  textToSpeech: true,

  // Features
  chatEnabled: true,
  formGuidanceEnabled: true,
  tutorialMode: false,
  highlightMode: "subtle",

  // AI Configuration
  aiProvider: "openai",
  aiModel: "gpt-4",
  apiKey: "",
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt:
    "You are a helpful AI assistant. Provide clear, concise, and friendly responses to user queries.",

  // Behavior
  welcomeMessage: "Hi! How can I help you today?",
  personality: "friendly",
  responseDelay: 1000,

  // Advanced
  customCSS: "",
  allowedDomains: "",
  analytics: true,
  autoUpdates: true,
};

const WidgetConfigContext = createContext<WidgetConfigContextType | undefined>(
  undefined,
);

export const useWidgetConfig = () => {
  const context = useContext(WidgetConfigContext);
  if (!context) {
    throw new Error(
      "useWidgetConfig must be used within a WidgetConfigProvider",
    );
  }
  return context;
};

interface WidgetConfigProviderProps {
  children: ReactNode;
  initialConfig?: Partial<WidgetConfig>;
}

export const WidgetConfigProvider: React.FC<WidgetConfigProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState<WidgetConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [originalConfig] = useState<WidgetConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };
      setIsDirty(JSON.stringify(newConfig) !== JSON.stringify(originalConfig));
      return newConfig;
    });
  };

  const updateMultipleConfig = (updates: Partial<WidgetConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      setIsDirty(JSON.stringify(newConfig) !== JSON.stringify(originalConfig));
      return newConfig;
    });
  };

  const resetConfig = () => {
    setConfig({ ...defaultConfig });
    setIsDirty(false);
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would save to your backend here
      console.log("Saving config:", config);

      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save config:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: WidgetConfigContextType = {
    config,
    updateConfig,
    updateMultipleConfig,
    resetConfig,
    saveConfig,
    isLoading,
    isDirty,
  };

  return (
    <WidgetConfigContext.Provider value={value}>
      {children}
    </WidgetConfigContext.Provider>
  );
};

export default WidgetConfigContext;
