import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Mic,
  Languages,
  Minimize2,
  Volume2,
  HelpCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ChatInterface from "./ChatInterface";
import ContextualGuidance from "./ContextualGuidance";
import {
  VisualGuidanceEngine,
  type GuidanceStep,
} from "./VisualGuidanceEngine";

interface AIAssistantWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  assistantName?: string;
  assistantAvatar?: string;
  languages?: string[];
  defaultLanguage?: string;
  voiceEnabled?: boolean;
  formInteractionEnabled?: boolean;
  tutorialMode?: boolean;
}

interface FieldContext {
  element: HTMLElement;
  fieldType: string;
  fieldName: string;
  labelText: string;
  placeholder: string;
  required: boolean;
  value: string;
}

interface AIResponse {
  explanation: string;
  suggestions: string[];
  voice_url?: string;
  validation?: {
    isValid: boolean;
    message: string;
  };
}

// Language Engine
class LanguageEngine {
  private currentLanguage: string;
  private translations: Record<string, Record<string, string>>;

  constructor(defaultLanguage: string = "en") {
    this.currentLanguage = defaultLanguage;
    this.translations = {
      en: {
        field_guidance: "Field Guidance",
        required_field: "This is a required field",
        optional_field: "This field is optional",
        email_format: "Please enter a valid email address",
        phone_format: "Please enter a valid phone number",
        date_format: "Please select a date",
        text_input: "Enter text information",
        number_input: "Enter a numeric value",
        select_option: "Choose an option from the dropdown",
        checkbox_option: "Check this box if applicable",
        textarea_input: "Enter detailed information",
        suggestions: "Suggestions",
        help_available: "Need help? Click for assistance",
        listening: "Listening...",
        processing: "Processing your request...",
      },
      ar: {
        field_guidance: "إرشادات الحقل",
        required_field: "هذا حقل مطلوب",
        optional_field: "هذا الحقل اختياري",
        email_format: "يرجى إدخال عنوان بريد إلكتروني صحيح",
        phone_format: "يرجى إدخال رقم هاتف صحيح",
        date_format: "يرجى اختيار تاريخ",
        text_input: "أدخل المعلومات النصية",
        number_input: "أدخل قيمة رقمية",
        select_option: "اختر خياراً من القائمة المنسدلة",
        checkbox_option: "ضع علامة في هذا المربع إذا كان ينطبق",
        textarea_input: "أدخل معلومات مفصلة",
        suggestions: "اقتراحات",
        help_available: "تحتاج مساعدة؟ انقر للحصول على المساعدة",
        listening: "أستمع...",
        processing: "معالجة طلبك...",
      },
      fr: {
        field_guidance: "Guide du champ",
        required_field: "Ce champ est obligatoire",
        optional_field: "Ce champ est optionnel",
        email_format: "Veuillez saisir une adresse e-mail valide",
        phone_format: "Veuillez saisir un numéro de téléphone valide",
        date_format: "Veuillez sélectionner une date",
        text_input: "Saisir des informations textuelles",
        number_input: "Saisir une valeur numérique",
        select_option: "Choisir une option dans la liste déroulante",
        checkbox_option: "Cocher cette case si applicable",
        textarea_input: "Saisir des informations détaillées",
        suggestions: "Suggestions",
        help_available: "Besoin d'aide? Cliquez pour assistance",
        listening: "Écoute...",
        processing: "Traitement de votre demande...",
      },
      es: {
        field_guidance: "Guía del campo",
        required_field: "Este campo es obligatorio",
        optional_field: "Este campo es opcional",
        email_format: "Por favor ingrese una dirección de correo válida",
        phone_format: "Por favor ingrese un número de teléfono válido",
        date_format: "Por favor seleccione una fecha",
        text_input: "Ingrese información de texto",
        number_input: "Ingrese un valor numérico",
        select_option: "Elija una opción del menú desplegable",
        checkbox_option: "Marque esta casilla si aplica",
        textarea_input: "Ingrese información detallada",
        suggestions: "Sugerencias",
        help_available: "¿Necesita ayuda? Haga clic para asistencia",
        listening: "Escuchando...",
        processing: "Procesando su solicitud...",
      },
      zh: {
        field_guidance: "字段指导",
        required_field: "这是必填字段",
        optional_field: "此字段为可选",
        email_format: "请输入有效的电子邮件地址",
        phone_format: "请输入有效的电话号码",
        date_format: "请选择日期",
        text_input: "输入文本信息",
        number_input: "输入数值",
        select_option: "从下拉菜单中选择选项",
        checkbox_option: "如适用请勾选此框",
        textarea_input: "输入详细信息",
        suggestions: "建议",
        help_available: "需要帮助？点击获取协助",
        listening: "正在聆听...",
        processing: "正在处理您的请求...",
      },
      de: {
        field_guidance: "Feldanleitung",
        required_field: "Dies ist ein Pflichtfeld",
        optional_field: "Dieses Feld ist optional",
        email_format: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        phone_format: "Bitte geben Sie eine gültige Telefonnummer ein",
        date_format: "Bitte wählen Sie ein Datum",
        text_input: "Textinformationen eingeben",
        number_input: "Numerischen Wert eingeben",
        select_option: "Option aus Dropdown-Menü wählen",
        checkbox_option: "Dieses Kästchen ankreuzen, falls zutreffend",
        textarea_input: "Detaillierte Informationen eingeben",
        suggestions: "Vorschläge",
        help_available: "Hilfe benötigt? Klicken Sie für Unterstützung",
        listening: "Höre zu...",
        processing: "Verarbeite Ihre Anfrage...",
      },
    };
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
  }

  translate(key: string): string {
    return (
      this.translations[this.currentLanguage]?.[key] ||
      this.translations["en"][key] ||
      key
    );
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}

// Voice Interface
class VoiceInterface {
  private synthesis: SpeechSynthesis;
  private recognition: any;
  private isListening: boolean = false;
  private currentLanguage: string;

  constructor(language: string = "en") {
    this.synthesis = window.speechSynthesis;
    this.currentLanguage = language;

    // Initialize speech recognition if available
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.getLanguageCode(language);
    }
  }

  private getLanguageCode(lang: string): string {
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

  speak(text: string, language?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language || this.currentLanguage);
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("Speech recognition not supported"));
        return;
      }

      this.isListening = true;
      this.recognition.lang = this.getLanguageCode(this.currentLanguage);

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (error: any) => {
        this.isListening = false;
        reject(error);
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = this.getLanguageCode(language);
    }
  }
}

// Form Interaction Engine
class FormInteractionEngine {
  private languageEngine: LanguageEngine;

  constructor(languageEngine: LanguageEngine) {
    this.languageEngine = languageEngine;
  }

  analyzeField(element: HTMLElement): FieldContext {
    const fieldType = this.getFieldType(element);
    const fieldName =
      element.getAttribute("name") || element.getAttribute("id") || "";
    const labelText = this.getFieldLabel(element);
    const placeholder = element.getAttribute("placeholder") || "";
    const required = element.hasAttribute("required");
    const value = (element as HTMLInputElement).value || "";

    return {
      element,
      fieldType,
      fieldName,
      labelText,
      placeholder,
      required,
      value,
    };
  }

  private getFieldType(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    if (tagName === "input") {
      return element.getAttribute("type") || "text";
    }
    return tagName;
  }

  private getFieldLabel(element: HTMLElement): string {
    const id = element.getAttribute("id");
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent || "";
    }

    // Look for parent label
    const parentLabel = element.closest("label");
    if (parentLabel) return parentLabel.textContent || "";

    // Look for sibling label
    const siblingLabel = element.previousElementSibling;
    if (siblingLabel && siblingLabel.tagName.toLowerCase() === "label") {
      return siblingLabel.textContent || "";
    }

    return "";
  }

  generateGuidance(fieldContext: FieldContext): AIResponse {
    const { fieldType, required, labelText, placeholder } = fieldContext;

    let explanation = "";
    let suggestions: string[] = [];

    // Generate contextual explanation
    const requiredText = required
      ? this.languageEngine.translate("required_field")
      : this.languageEngine.translate("optional_field");

    switch (fieldType) {
      case "email":
        explanation = `${labelText || "Email"} - ${this.languageEngine.translate("email_format")}. ${requiredText}.`;
        suggestions = ["example@domain.com", "user.name@company.org"];
        break;
      case "tel":
      case "phone":
        explanation = `${labelText || "Phone"} - ${this.languageEngine.translate("phone_format")}. ${requiredText}.`;
        suggestions = ["+1 (555) 123-4567", "+44 20 7946 0958"];
        break;
      case "date":
        explanation = `${labelText || "Date"} - ${this.languageEngine.translate("date_format")}. ${requiredText}.`;
        suggestions = [];
        break;
      case "number":
        explanation = `${labelText || "Number"} - ${this.languageEngine.translate("number_input")}. ${requiredText}.`;
        suggestions = [];
        break;
      case "select":
        explanation = `${labelText || "Selection"} - ${this.languageEngine.translate("select_option")}. ${requiredText}.`;
        suggestions = [];
        break;
      case "checkbox":
        explanation = `${labelText || "Checkbox"} - ${this.languageEngine.translate("checkbox_option")}.`;
        suggestions = [];
        break;
      case "textarea":
        explanation = `${labelText || "Text Area"} - ${this.languageEngine.translate("textarea_input")}. ${requiredText}.`;
        suggestions = [];
        break;
      default:
        explanation = `${labelText || "Text Input"} - ${this.languageEngine.translate("text_input")}. ${requiredText}.`;
        if (placeholder) {
          suggestions = [placeholder];
        }
        break;
    }

    return {
      explanation,
      suggestions,
      validation: this.validateField(fieldContext),
    };
  }

  private validateField(fieldContext: FieldContext): {
    isValid: boolean;
    message: string;
  } {
    const { fieldType, required, value } = fieldContext;

    if (required && !value.trim()) {
      return {
        isValid: false,
        message: this.languageEngine.translate("required_field"),
      };
    }

    if (value.trim()) {
      switch (fieldType) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return {
            isValid: emailRegex.test(value),
            message: emailRegex.test(value)
              ? "Valid email"
              : this.languageEngine.translate("email_format"),
          };
        case "tel":
        case "phone":
          const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,}$/;
          return {
            isValid: phoneRegex.test(value.replace(/\s/g, "")),
            message: phoneRegex.test(value.replace(/\s/g, ""))
              ? "Valid phone"
              : this.languageEngine.translate("phone_format"),
          };
      }
    }

    return { isValid: true, message: "Valid" };
  }
}

const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  position = "bottom-right",
  primaryColor = "#7C3AED",
  assistantName = "Murakib",
  assistantAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=murakib",
  languages = ["en", "ar", "fr", "es", "zh", "de"],
  defaultLanguage = "en",
  voiceEnabled = true,
  formInteractionEnabled = true,
  tutorialMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null,
  );
  const [showGuidance, setShowGuidance] = useState(false);
  const [guidanceContent, setGuidanceContent] = useState<AIResponse | null>(
    null,
  );
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visualGuidanceSteps, setVisualGuidanceSteps] = useState<
    GuidanceStep[]
  >([]);
  const [isVisualGuidanceActive, setIsVisualGuidanceActive] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);
  const languageEngineRef = useRef<LanguageEngine>(
    new LanguageEngine(defaultLanguage),
  );
  const voiceInterfaceRef = useRef<VoiceInterface>(
    new VoiceInterface(defaultLanguage),
  );
  const formEngineRef = useRef<FormInteractionEngine>(
    new FormInteractionEngine(languageEngineRef.current),
  );

  // Position classes based on the position prop
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  // Toggle the widget open/closed state
  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Minimize the widget
  const minimizeWidget = () => {
    setIsMinimized(true);
  };

  // Close the widget completely
  const closeWidget = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Language change handler
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setActiveLanguage(newLanguage);
    languageEngineRef.current.setLanguage(newLanguage);
    voiceInterfaceRef.current.setLanguage(newLanguage);
  }, []);

  // Voice interaction handlers
  const handleVoiceInput = useCallback(async () => {
    if (!voiceEnabled) return;

    try {
      setIsListening(true);
      const transcript = await voiceInterfaceRef.current.startListening();
      setIsListening(false);

      // Process voice input (this would typically call your AI backend)
      setIsProcessing(true);
      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false);
        // Handle the transcript
        console.log("Voice input received:", transcript);
      }, 1000);
    } catch (error) {
      setIsListening(false);
      console.error("Voice input error:", error);
    }
  }, [voiceEnabled]);

  const handleTextToSpeech = useCallback(
    async (text: string) => {
      if (!voiceEnabled) return;

      try {
        setIsSpeaking(true);
        await voiceInterfaceRef.current.speak(text, activeLanguage);
        setIsSpeaking(false);
      } catch (error) {
        setIsSpeaking(false);
        console.error("Text-to-speech error:", error);
      }
    },
    [voiceEnabled, activeLanguage],
  );

  // Enhanced form field focus detection with AI-powered guidance
  useEffect(() => {
    if (!formInteractionEnabled) return;

    const handleFocus = async (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"
      ) {
        setFocusedElement(target);

        // Analyze field using Form Interaction Engine
        const fieldContext = formEngineRef.current.analyzeField(target);
        const aiResponse = formEngineRef.current.generateGuidance(fieldContext);

        setGuidanceContent(aiResponse);
        setShowGuidance(true);

        // Auto-speak guidance if voice is enabled and not already speaking
        if (voiceEnabled && !isSpeaking && aiResponse.explanation) {
          handleTextToSpeech(aiResponse.explanation);
        }

        // Trigger visual guidance for complex fields
        if (
          fieldContext.fieldType === "email" ||
          fieldContext.fieldType === "tel" ||
          fieldContext.required
        ) {
          const guidanceSteps: GuidanceStep[] = [
            {
              id: "field-highlight",
              selector: `#${target.id}, [name="${target.getAttribute("name")}"]`,
              type: "highlight",
              message: aiResponse.explanation,
              position: "bottom",
              delay: 500,
            },
          ];
          setVisualGuidanceSteps(guidanceSteps);
          setIsVisualGuidanceActive(true);
        }
      }
    };

    const handleBlur = () => {
      // Small delay to allow for clicking on guidance before hiding
      setTimeout(() => {
        setShowGuidance(false);
        setFocusedElement(null);
        setGuidanceContent(null);
      }, 300);
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (focusedElement === target && guidanceContent) {
        // Real-time validation
        const fieldContext = formEngineRef.current.analyzeField(target);
        const updatedResponse =
          formEngineRef.current.generateGuidance(fieldContext);
        setGuidanceContent(updatedResponse);
      }
    };

    // Add event listeners
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);
    document.addEventListener("input", handleInput);

    return () => {
      // Clean up event listeners
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
      document.removeEventListener("input", handleInput);
    };
  }, [
    formInteractionEnabled,
    focusedElement,
    guidanceContent,
    voiceEnabled,
    isSpeaking,
    handleTextToSpeech,
  ]);

  // Tutorial mode handler
  useEffect(() => {
    if (tutorialMode && isOpen) {
      // Implement tutorial flow
      const tutorialSteps = [
        "Welcome to Murakib AI Assistant! I'll help you fill out this form.",
        "I can provide guidance for each field when you click on them.",
        "You can also use voice commands by clicking the microphone button.",
        "I support multiple languages - just select your preferred language.",
      ];

      if (tutorialStep < tutorialSteps.length) {
        const currentStep = tutorialSteps[tutorialStep];
        if (voiceEnabled) {
          handleTextToSpeech(currentStep);
        }

        setTimeout(() => {
          setTutorialStep((prev) => prev + 1);
        }, 3000);
      }
    }
  }, [tutorialMode, isOpen, tutorialStep, voiceEnabled, handleTextToSpeech]);

  // Handle clicking outside the widget to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node) &&
        isOpen &&
        !isMinimized
      ) {
        // Don't close if clicking on a form field that might trigger guidance
        const target = event.target as HTMLElement;
        if (
          !(
            target.tagName === "INPUT" ||
            target.tagName === "SELECT" ||
            target.tagName === "TEXTAREA"
          )
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMinimized]);

  return (
    <div
      className="fixed z-50"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Contextual Guidance Component */}
      {showGuidance && focusedElement && guidanceContent && (
        <ContextualGuidance
          isVisible={showGuidance}
          targetElement={focusedElement}
          guidanceType="tooltip"
          content={{
            title: languageEngineRef.current.translate("field_guidance"),
            description: guidanceContent.explanation,
            suggestions: guidanceContent.suggestions,
          }}
          position="bottom"
          status={
            guidanceContent.validation?.isValid === false ? "error" : "info"
          }
          onClose={() => setShowGuidance(false)}
        />
      )}

      {/* Visual Guidance Engine */}
      <VisualGuidanceEngine
        steps={visualGuidanceSteps}
        isActive={isVisualGuidanceActive}
        onComplete={() => setIsVisualGuidanceActive(false)}
        onStepComplete={(stepId) => {
          console.log(`Visual guidance step completed: ${stepId}`);
        }}
        autoAdvance={true}
        showProgress={false}
      />

      {/* Main Widget */}
      <div ref={widgetRef} className={`${positionClasses[position]} fixed`}>
        <AnimatePresence>
          {/* Collapsed Widget Button */}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleWidget}
                      className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {isListening ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="absolute inset-0 bg-red-500 rounded-full opacity-20"
                        />
                      ) : null}
                      {isProcessing ? (
                        <Zap className="h-6 w-6 text-white animate-pulse" />
                      ) : isListening ? (
                        <Mic className="h-6 w-6 text-white" />
                      ) : (
                        <MessageCircle className="h-6 w-6 text-white" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isListening
                        ? languageEngineRef.current.translate("listening")
                        : isProcessing
                          ? languageEngineRef.current.translate("processing")
                          : languageEngineRef.current.translate(
                              "help_available",
                            )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}

          {/* Expanded Widget */}
          {isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`bg-white rounded-lg shadow-xl overflow-hidden ${isMinimized ? "w-auto" : "w-[350px]"}`}
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              {/* Widget Header */}
              <div
                className="p-4 flex items-center justify-between"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={assistantAvatar} alt={assistantName} />
                    <AvatarFallback>
                      {assistantName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!isMinimized && (
                    <div className="text-white">
                      <h3 className="font-medium">{assistantName}</h3>
                      <p className="text-xs opacity-80">AI Assistant</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!isMinimized && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={minimizeWidget}
                      className="text-white hover:bg-white/20"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeWidget}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Widget Content */}
              {!isMinimized && (
                <ChatInterface
                  onClose={closeWidget}
                  onMinimize={minimizeWidget}
                  isOpen={isOpen}
                />
              )}

              {/* Quick Action Buttons */}
              {!isMinimized && (
                <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
                  <div className="flex space-x-2">
                    {voiceEnabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVoiceInput}
                        disabled={isListening || isProcessing}
                        className={
                          isListening ? "bg-red-50 border-red-200" : ""
                        }
                      >
                        <Mic className="h-4 w-4 mr-1" />
                        {isListening ? "Listening..." : "Voice"}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const formElements = document.querySelectorAll(
                          "input, select, textarea",
                        );
                        if (formElements.length > 0) {
                          (formElements[0] as HTMLElement).focus();
                        }
                      }}
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Guide Me
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    {languageEngineRef.current
                      .getCurrentLanguage()
                      .toUpperCase()}
                  </div>
                </div>
              )}

              {/* Minimized Widget Footer */}
              {isMinimized && (
                <div className="p-2 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(false)}
                    className="text-xs"
                  >
                    Expand
                  </Button>
                  <div className="flex space-x-1">
                    {voiceEnabled && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mic className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Languages className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAssistantWidget;
