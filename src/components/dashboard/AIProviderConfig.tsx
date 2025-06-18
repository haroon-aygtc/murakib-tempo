import React from "react";
import { Settings, Wand2, Brain, Zap, AlertCircle, Info } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWidgetConfig } from "@/contexts/WidgetConfigContext";

interface AIModel {
  value: string;
  label: string;
  description?: string;
  maxTokens?: number;
  features?: string[];
}

interface AIProvider {
  value: string;
  label: string;
  description: string;
  models: AIModel[];
  requiresApiKey: boolean;
  features: string[];
  pricing?: string;
}

const aiProviders: AIProvider[] = [
  {
    value: "openai",
    label: "OpenAI",
    description: "Industry-leading language models with excellent performance",
    requiresApiKey: true,
    features: ["Chat", "Completion", "Function Calling", "Vision"],
    pricing: "Pay-per-token",
    models: [
      {
        value: "gpt-4",
        label: "GPT-4",
        description: "Most capable model, best for complex tasks",
        maxTokens: 8192,
        features: ["Advanced reasoning", "Code generation", "Creative writing"],
      },
      {
        value: "gpt-4-turbo",
        label: "GPT-4 Turbo",
        description: "Faster and more cost-effective than GPT-4",
        maxTokens: 128000,
        features: ["Large context", "JSON mode", "Function calling"],
      },
      {
        value: "gpt-3.5-turbo",
        label: "GPT-3.5 Turbo",
        description: "Fast and cost-effective for most use cases",
        maxTokens: 16385,
        features: ["Fast responses", "Cost-effective", "Function calling"],
      },
    ],
  },
  {
    value: "anthropic",
    label: "Anthropic",
    description: "Claude models focused on safety and helpfulness",
    requiresApiKey: true,
    features: ["Safety-focused", "Long context", "Constitutional AI"],
    pricing: "Pay-per-token",
    models: [
      {
        value: "claude-3-opus",
        label: "Claude 3 Opus",
        description: "Most powerful Claude model for complex tasks",
        maxTokens: 200000,
        features: ["Exceptional reasoning", "Creative tasks", "Analysis"],
      },
      {
        value: "claude-3-sonnet",
        label: "Claude 3 Sonnet",
        description: "Balanced performance and speed",
        maxTokens: 200000,
        features: ["Balanced performance", "Good reasoning", "Fast responses"],
      },
      {
        value: "claude-3-haiku",
        label: "Claude 3 Haiku",
        description: "Fastest Claude model for simple tasks",
        maxTokens: 200000,
        features: ["Ultra-fast", "Cost-effective", "Simple tasks"],
      },
    ],
  },
  {
    value: "google",
    label: "Google AI",
    description: "Gemini models with multimodal capabilities",
    requiresApiKey: true,
    features: ["Multimodal", "Code generation", "Reasoning"],
    pricing: "Pay-per-token",
    models: [
      {
        value: "gemini-pro",
        label: "Gemini Pro",
        description: "Advanced reasoning and code generation",
        maxTokens: 32768,
        features: ["Code generation", "Reasoning", "Analysis"],
      },
      {
        value: "gemini-pro-vision",
        label: "Gemini Pro Vision",
        description: "Multimodal model with vision capabilities",
        maxTokens: 16384,
        features: ["Vision", "Image analysis", "Multimodal"],
      },
    ],
  },
  {
    value: "azure",
    label: "Azure OpenAI",
    description: "OpenAI models hosted on Microsoft Azure",
    requiresApiKey: true,
    features: ["Enterprise security", "Compliance", "SLA"],
    pricing: "Pay-per-token",
    models: [
      {
        value: "gpt-4",
        label: "GPT-4 (Azure)",
        description: "GPT-4 with enterprise features",
        maxTokens: 8192,
        features: ["Enterprise security", "Compliance", "SLA"],
      },
      {
        value: "gpt-35-turbo",
        label: "GPT-3.5 Turbo (Azure)",
        description: "GPT-3.5 Turbo with enterprise features",
        maxTokens: 16385,
        features: ["Enterprise security", "Cost-effective", "Fast"],
      },
    ],
  },
  {
    value: "cohere",
    label: "Cohere",
    description: "Enterprise-focused language models",
    requiresApiKey: true,
    features: ["Enterprise focus", "Multilingual", "Embeddings"],
    pricing: "Pay-per-token",
    models: [
      {
        value: "command",
        label: "Command",
        description: "Powerful model for complex tasks",
        maxTokens: 4096,
        features: ["Complex reasoning", "Multilingual", "Enterprise"],
      },
      {
        value: "command-light",
        label: "Command Light",
        description: "Faster model for simple tasks",
        maxTokens: 4096,
        features: ["Fast responses", "Cost-effective", "Simple tasks"],
      },
    ],
  },
  {
    value: "huggingface",
    label: "Hugging Face",
    description: "Open-source models and custom deployments",
    requiresApiKey: false,
    features: ["Open source", "Custom models", "Community"],
    pricing: "Free/Custom",
    models: [
      {
        value: "mistral-7b",
        label: "Mistral 7B",
        description: "Open-source model with good performance",
        maxTokens: 8192,
        features: ["Open source", "Good performance", "Customizable"],
      },
      {
        value: "llama-2-7b",
        label: "Llama 2 7B",
        description: "Meta's open-source language model",
        maxTokens: 4096,
        features: ["Open source", "Research-friendly", "Customizable"],
      },
    ],
  },
];

const AIProviderConfig: React.FC = () => {
  const { config, updateConfig } = useWidgetConfig();

  const currentProvider = aiProviders.find(
    (provider) => provider.value === config.aiProvider,
  );
  const currentModel = currentProvider?.models.find(
    (model) => model.value === config.aiModel,
  );

  const handleProviderChange = (providerValue: string) => {
    const provider = aiProviders.find((p) => p.value === providerValue);
    if (provider) {
      updateConfig("aiProvider", providerValue);
      if (provider.models.length > 0) {
        updateConfig("aiModel", provider.models[0].value);
      }
      updateConfig("apiKey", "");
    }
  };

  const getTemperatureDescription = (temp: number) => {
    if (temp <= 0.3) return "Very focused and deterministic";
    if (temp <= 0.7) return "Balanced creativity and consistency";
    if (temp <= 1.2) return "More creative and varied responses";
    return "Highly creative and unpredictable";
  };

  const getTokensDescription = (tokens: number) => {
    if (tokens <= 500) return "Short responses";
    if (tokens <= 1500) return "Medium-length responses";
    if (tokens <= 3000) return "Long responses";
    return "Very long responses";
  };

  return (
    <div className="space-y-6 bg-background">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Provider</span>
          </CardTitle>
          <CardDescription>
            Choose your AI provider and configure the model settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={config.aiProvider}
                onValueChange={handleProviderChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      <div className="flex items-center space-x-2">
                        <span>{provider.label}</span>
                        {!provider.requiresApiKey && (
                          <Badge variant="secondary" className="text-xs">
                            Free
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={config.aiModel}
                onValueChange={(value) => updateConfig("aiModel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentProvider?.models.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex flex-col">
                        <span>{model.label}</span>
                        {model.description && (
                          <span className="text-xs text-muted-foreground">
                            {model.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentProvider && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{currentProvider.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {currentProvider.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {currentProvider.pricing && (
                    <p className="text-sm text-muted-foreground">
                      Pricing: {currentProvider.pricing}
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {currentModel && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{currentModel.label}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {currentModel.description}
              </p>
              {currentModel.maxTokens && (
                <p className="text-sm text-muted-foreground mb-2">
                  Max tokens: {currentModel.maxTokens.toLocaleString()}
                </p>
              )}
              {currentModel.features && (
                <div className="flex flex-wrap gap-1">
                  {currentModel.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {currentProvider?.requiresApiKey && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your API credentials and connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={`Enter your ${currentProvider.label} API key`}
                value={config.apiKey}
                onChange={(e) => updateConfig("apiKey", e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Your API key is stored securely and never shared. Get your API
                key from the {currentProvider.label} dashboard.
              </div>
            </div>

            {!config.apiKey && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  An API key is required to use {currentProvider.label} models.
                  The assistant will not function without a valid API key.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Model Parameters</span>
          </CardTitle>
          <CardDescription>
            Fine-tune the AI model's behavior and response characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              placeholder="Define how the AI should behave and respond..."
              value={config.systemPrompt}
              onChange={(e) => updateConfig("systemPrompt", e.target.value)}
              rows={4}
            />
            <div className="text-xs text-muted-foreground">
              The system prompt defines the AI's personality, behavior, and
              response style. Be specific about the role and context.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <Badge variant="outline">{config.temperature}</Badge>
              </div>
              <Slider
                value={[config.temperature]}
                onValueChange={(value) => updateConfig("temperature", value[0])}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {getTemperatureDescription(config.temperature)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Tokens</Label>
                <Badge variant="outline">
                  {config.maxTokens.toLocaleString()}
                </Badge>
              </div>
              <Slider
                value={[config.maxTokens]}
                onValueChange={(value) => updateConfig("maxTokens", value[0])}
                max={currentModel?.maxTokens || 4000}
                min={100}
                step={100}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {getTokensDescription(config.maxTokens)}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Wand2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Parameter Guidelines
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                  <li>
                    • Lower temperature (0.0-0.3) for consistent, factual
                    responses
                  </li>
                  <li>
                    • Medium temperature (0.4-0.8) for balanced creativity
                  </li>
                  <li>
                    • Higher temperature (0.9-2.0) for creative, varied
                    responses
                  </li>
                  <li>• Adjust max tokens based on expected response length</li>
                  <li>
                    • System prompt should be clear and specific about the AI's
                    role
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Additional configuration options for fine-tuning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Response Timeout (seconds)</Label>
              <Input
                type="number"
                min="5"
                max="60"
                defaultValue="30"
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label>Retry Attempts</Label>
              <Input
                type="number"
                min="1"
                max="5"
                defaultValue="3"
                placeholder="3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Headers (JSON)</Label>
            <Textarea placeholder='{"Custom-Header": "value"}' rows={3} />
            <div className="text-xs text-muted-foreground">
              Optional custom headers to include with API requests
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIProviderConfig;
