import React from "react";
import { Globe, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
  supportedLanguages?: string[];
  variant?: "select" | "popover" | "compact";
  showNativeNames?: boolean;
  showFlags?: boolean;
  className?: string;
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    rtl: true,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    flag: "🇳🇱",
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    flag: "🇸🇪",
  },
  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    flag: "🇳🇴",
  },
  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    flag: "🇩🇰",
  },
  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    flag: "🇫🇮",
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    flag: "🇵🇱",
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    flag: "🇹🇭",
  },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage = "en",
  onLanguageChange = () => {},
  supportedLanguages = ["en", "es", "fr", "de", "zh", "ar"],
  variant = "select",
  showNativeNames = true,
  showFlags = true,
  className = "",
}) => {
  const availableLanguages = languages.filter((lang) =>
    supportedLanguages.includes(lang.code),
  );

  const selectedLang =
    availableLanguages.find((lang) => lang.code === selectedLanguage) ||
    availableLanguages[0];

  const formatLanguageDisplay = (language: Language, compact = false) => {
    const parts = [];

    if (showFlags && !compact) {
      parts.push(language.flag);
    }

    if (compact) {
      parts.push(language.code.toUpperCase());
    } else {
      parts.push(language.name);
      if (showNativeNames && language.nativeName !== language.name) {
        parts.push(`(${language.nativeName})`);
      }
    }

    return parts.join(" ");
  };

  if (variant === "select") {
    return (
      <div className={className}>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {showFlags && selectedLang && (
                <span className="mr-2">{selectedLang.flag}</span>
              )}
              {selectedLang?.name || "Select Language"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex items-center space-x-2">
                  {showFlags && <span>{language.flag}</span>}
                  <span>{language.name}</span>
                  {showNativeNames && language.nativeName !== language.name && (
                    <span className="text-muted-foreground text-sm">
                      ({language.nativeName})
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className={`w-20 ${className}`}>
          <SelectValue>{selectedLang?.code.toUpperCase() || "EN"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                {showFlags && <span>{language.flag}</span>}
                <span>{language.code.toUpperCase()}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Popover variant
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`justify-start ${className}`}>
          <Globe className="h-4 w-4 mr-2" />
          {showFlags && selectedLang && (
            <span className="mr-2">{selectedLang.flag}</span>
          )}
          {selectedLang?.name || "Select Language"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <Label className="text-sm font-medium">Select Language</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Choose your preferred language for the interface
          </p>
        </div>
        <Separator />
        <div className="max-h-60 overflow-y-auto">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors ${
                selectedLanguage === language.code ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                {showFlags && <span className="text-lg">{language.flag}</span>}
                <div>
                  <div className="font-medium">{language.name}</div>
                  {showNativeNames && language.nativeName !== language.name && (
                    <div className="text-sm text-muted-foreground">
                      {language.nativeName}
                    </div>
                  )}
                </div>
              </div>
              {selectedLanguage === language.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
        <Separator />
        <div className="p-3">
          <div className="flex flex-wrap gap-1">
            {availableLanguages.slice(0, 6).map((language) => (
              <Badge
                key={language.code}
                variant={
                  selectedLanguage === language.code ? "default" : "secondary"
                }
                className="cursor-pointer text-xs"
                onClick={() => onLanguageChange(language.code)}
              >
                {showFlags && language.flag} {language.code.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
