import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  X,
  Globe,
  Minimize2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onClose?: () => void;
  onMinimize?: () => void;
  isOpen?: boolean;
  assistantName?: string;
  assistantAvatar?: string;
  activeLanguage?: string;
  setActiveLanguage?: (lang: string) => void;
  languages?: string[];
  voiceEnabled?: boolean;
}

interface AIMessage extends Message {
  type?: "text" | "guidance" | "suggestion";
  metadata?: {
    fieldContext?: string;
    suggestions?: string[];
    confidence?: number;
  };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onClose = () => {},
  onMinimize = () => {},
  isOpen = true,
  assistantName = "Murakib",
  assistantAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=murakib",
  activeLanguage = "en",
  setActiveLanguage = () => {},
  languages = ["en", "ar", "fr", "es", "zh", "de"],
  voiceEnabled = true,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      text: getWelcomeMessage(activeLanguage, assistantName),
      sender: "assistant",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [contextualHelp, setContextualHelp] = useState<string | null>(null);

  // Welcome message translations
  function getWelcomeMessage(lang: string, name: string): string {
    const messages: Record<string, string> = {
      en: `Hello! I'm ${name}, your AI assistant. I can help you fill out forms, translate content, and guide you through any process. How can I assist you today?`,
      ar: `مرحباً! أنا ${name}، مساعدك الذكي. يمكنني مساعدتك في ملء النماذج وترجمة المحتوى وإرشادك خلال أي عملية. كيف يمكنني مساعدتك اليوم؟`,
      fr: `Bonjour! Je suis ${name}, votre assistant IA. Je peux vous aider à remplir des formulaires, traduire du contenu et vous guider dans tout processus. Comment puis-je vous aider aujourd'hui?`,
      es: `¡Hola! Soy ${name}, tu asistente de IA. Puedo ayudarte a llenar formularios, traducir contenido y guiarte a través de cualquier proceso. ¿Cómo puedo ayudarte hoy?`,
      zh: `你好！我是${name}，你的AI助手。我可以帮助你填写表格、翻译内容并指导你完成任何流程。今天我可以为你做些什么？`,
      de: `Hallo! Ich bin ${name}, Ihr KI-Assistent. Ich kann Ihnen beim Ausfüllen von Formularen, beim Übersetzen von Inhalten und bei der Anleitung durch jeden Prozess helfen. Wie kann ich Ihnen heute helfen?`,
    };
    return messages[lang] || messages.en;
  }

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newUserMessage: AIMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI processing with contextual awareness
    try {
      const response = await processUserMessage(inputText, activeLanguage);

      setTimeout(
        () => {
          const assistantResponse: AIMessage = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: "assistant",
            timestamp: new Date(),
            type: response.type,
            metadata: response.metadata,
          };
          setMessages((prev) => [...prev, assistantResponse]);
          setIsTyping(false);

          // Auto-speak response if voice is enabled
          if (isSpeechEnabled && response.text) {
            speakText(response.text);
          }
        },
        1000 + Math.random() * 1000,
      ); // Realistic response time
    } catch (error) {
      setIsTyping(false);
      console.error("Error processing message:", error);
    }
  };

  // AI Message Processing (would connect to your backend)
  async function processUserMessage(
    message: string,
    language: string,
  ): Promise<{
    text: string;
    type: "text" | "guidance" | "suggestion";
    metadata?: any;
  }> {
    // This would typically call your AI backend
    // For now, we'll simulate intelligent responses based on context

    const lowerMessage = message.toLowerCase();

    // Form-related queries
    if (
      lowerMessage.includes("form") ||
      lowerMessage.includes("fill") ||
      lowerMessage.includes("field")
    ) {
      return {
        text: getLocalizedResponse("form_help", language),
        type: "guidance",
        metadata: {
          suggestions: [
            "Click on any form field for specific guidance",
            "Use voice input to fill fields quickly",
            "I can validate your entries in real-time",
          ],
        },
      };
    }

    // Language-related queries
    if (
      lowerMessage.includes("language") ||
      lowerMessage.includes("translate")
    ) {
      return {
        text: getLocalizedResponse("language_help", language),
        type: "guidance",
        metadata: {
          suggestions: [
            "Change language using the dropdown",
            "I can translate form labels",
            "Voice input works in multiple languages",
          ],
        },
      };
    }

    // Voice-related queries
    if (
      lowerMessage.includes("voice") ||
      lowerMessage.includes("speak") ||
      lowerMessage.includes("listen")
    ) {
      return {
        text: getLocalizedResponse("voice_help", language),
        type: "guidance",
        metadata: {
          suggestions: [
            "Click the microphone to use voice input",
            "I can read form guidance aloud",
            "Voice works in your selected language",
          ],
        },
      };
    }

    // General help
    return {
      text: getLocalizedResponse("general_help", language),
      type: "text",
      metadata: {
        suggestions: [
          "Ask about form fields",
          "Request language help",
          "Try voice commands",
        ],
      },
    };
  }

  function getLocalizedResponse(key: string, language: string): string {
    const responses: Record<string, Record<string, string>> = {
      form_help: {
        en: "I can help you with form filling! Click on any field and I'll provide specific guidance, suggest values, and validate your input in real-time.",
        ar: "يمكنني مساعدتك في ملء النماذج! انقر على أي حقل وسأقدم إرشادات محددة واقتراح قيم والتحقق من إدخالك في الوقت الفعلي.",
        fr: "Je peux vous aider à remplir des formulaires! Cliquez sur n'importe quel champ et je fournirai des conseils spécifiques, suggérerai des valeurs et validerai votre saisie en temps réel.",
        es: "¡Puedo ayudarte a llenar formularios! Haz clic en cualquier campo y proporcionaré orientación específica, sugeriré valores y validaré tu entrada en tiempo real.",
        zh: "我可以帮助你填写表格！点击任何字段，我会提供具体指导、建议值并实时验证你的输入。",
        de: "Ich kann Ihnen beim Ausfüllen von Formularen helfen! Klicken Sie auf ein beliebiges Feld und ich gebe spezifische Anleitung, schlage Werte vor und validiere Ihre Eingabe in Echtzeit.",
      },
      language_help: {
        en: "I support multiple languages! You can change the interface language, and I'll translate form guidance and speak in your preferred language.",
        ar: "أدعم لغات متعددة! يمكنك تغيير لغة الواجهة، وسأترجم إرشادات النموذج وأتحدث بلغتك المفضلة.",
        fr: "Je supporte plusieurs langues! Vous pouvez changer la langue de l'interface, et je traduirai les conseils de formulaire et parlerai dans votre langue préférée.",
        es: "¡Apoyo múltiples idiomas! Puedes cambiar el idioma de la interfaz, y traduciré la orientación del formulario y hablaré en tu idioma preferido.",
        zh: "我支持多种语言！你可以更改界面语言，我会翻译表格指导并用你喜欢的语言说话。",
        de: "Ich unterstütze mehrere Sprachen! Sie können die Schnittstellensprache ändern, und ich übersetze Formularanleitungen und spreche in Ihrer bevorzugten Sprache.",
      },
      voice_help: {
        en: "Voice features are available! You can speak your questions or use voice to fill form fields. I can also read guidance aloud to you.",
        ar: "ميزات الصوت متاحة! يمكنك نطق أسئلتك أو استخدام الصوت لملء حقول النموذج. يمكنني أيضاً قراءة الإرشادات بصوت عالٍ لك.",
        fr: "Les fonctionnalités vocales sont disponibles! Vous pouvez parler vos questions ou utiliser la voix pour remplir les champs de formulaire. Je peux aussi vous lire les conseils à haute voix.",
        es: "¡Las funciones de voz están disponibles! Puedes hablar tus preguntas o usar la voz para llenar campos de formulario. También puedo leerte la orientación en voz alta.",
        zh: "语音功能可用！你可以说出你的问题或使用语音填写表格字段。我也可以大声为你朗读指导。",
        de: "Sprachfunktionen sind verfügbar! Sie können Ihre Fragen sprechen oder Sprache verwenden, um Formularfelder auszufüllen. Ich kann Ihnen auch Anleitungen vorlesen.",
      },
      general_help: {
        en: "I'm here to help! I can assist with form filling, provide translations, offer voice interaction, and guide you through any process step by step.",
        ar: "أنا هنا للمساعدة! يمكنني المساعدة في ملء النماذج وتقديم الترجمات وتوفير التفاعل الصوتي وإرشادك خلال أي عملية خطوة بخطوة.",
        fr: "Je suis là pour aider! Je peux aider avec le remplissage de formulaires, fournir des traductions, offrir une interaction vocale et vous guider à travers tout processus étape par étape.",
        es: "¡Estoy aquí para ayudar! Puedo ayudar con el llenado de formularios, proporcionar traducciones, ofrecer interacción por voz y guiarte a través de cualquier proceso paso a paso.",
        zh: "我在这里帮助你！我可以协助填写表格、提供翻译、提供语音交互，并逐步指导你完成任何流程。",
        de: "Ich bin hier, um zu helfen! Ich kann beim Ausfüllen von Formularen helfen, Übersetzungen bereitstellen, Sprachinteraktion anbieten und Sie Schritt für Schritt durch jeden Prozess führen.",
      },
    };

    return (
      responses[key]?.[language] ||
      responses[key]?.en ||
      "I'm here to help you!"
    );
  }

  // Text-to-speech function
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(activeLanguage);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  function getLanguageCode(lang: string): string {
    const langCodes: Record<string, string> = {
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      es: "es-ES",
      zh: "zh-CN",
      de: "de-DE",
    };
    return langCodes[lang] || "en-US";
  }

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would implement actual speech-to-text functionality
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  const handleLanguageChange = (value: string) => {
    setActiveLanguage(value);

    // Update welcome message in new language
    setMessages((prev) => [
      {
        ...prev[0],
        text: getWelcomeMessage(value, assistantName),
      },
      ...prev.slice(1),
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <motion.div
      className="bg-background border rounded-lg shadow-lg flex flex-col w-80 h-[450px] relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <img
            src={assistantAvatar}
            alt={assistantName}
            className="w-6 h-6 rounded-full"
          />
          <h3 className="font-medium">{assistantName}</h3>
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground"
                  onClick={onMinimize}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Minimize</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.type === "guidance"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>

                {/* Show suggestions for AI messages */}
                {message.sender === "assistant" &&
                  message.metadata?.suggestions && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium opacity-70">
                        Quick actions:
                      </p>
                      {message.metadata.suggestions.map(
                        (suggestion: string, index: number) => (
                          <button
                            key={index}
                            className="block text-xs bg-white rounded px-2 py-1 border border-gray-200 hover:bg-gray-50 text-left w-full"
                            onClick={() => setInputText(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ),
                      )}
                    </div>
                  )}

                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Voice playback for assistant messages */}
                  {message.sender === "assistant" && isSpeechEnabled && (
                    <button
                      onClick={() => speakText(message.text)}
                      className="text-xs opacity-70 hover:opacity-100 ml-2"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Controls Area */}
      <div className="p-3 border-t">
        <div className="flex justify-between mb-2">
          <LanguageSelector
            selectedLanguage={activeLanguage}
            onLanguageChange={handleLanguageChange}
            supportedLanguages={languages}
            variant="compact"
            className="w-[120px] h-8"
          />

          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleSpeech}
                  >
                    {isSpeechEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSpeechEnabled ? "Disable" : "Enable"} text-to-speech</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 ${isListening ? "bg-red-100 text-red-500 border-red-200" : ""}`}
                    onClick={toggleListening}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isListening ? "Stop" : "Start"} voice input</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={handleKeyPress}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputText.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
