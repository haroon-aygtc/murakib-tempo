import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  Volume2,
  FileText,
  CheckCircle,
  AlertCircle,
  Settings,
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  completionRate: number;
  voiceModel?: string;
  lastUpdated: string;
}

interface Translation {
  key: string;
  english: string;
  translations: Record<string, string>;
}

const LanguageManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddLanguageOpen, setIsAddLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState({
    code: "",
    name: "",
    nativeName: "",
    voiceModel: "",
  });

  // Mock data
  const [languages, setLanguages] = useState<Language[]>([
    {
      id: "1",
      code: "en",
      name: "English",
      nativeName: "English",
      isActive: true,
      completionRate: 100,
      voiceModel: "elevenlabs-nova",
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      isActive: true,
      completionRate: 95,
      voiceModel: "elevenlabs-alloy",
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      code: "fr",
      name: "French",
      nativeName: "Français",
      isActive: true,
      completionRate: 88,
      voiceModel: "google-wavenet",
      lastUpdated: "2024-01-12",
    },
    {
      id: "4",
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      isActive: false,
      completionRate: 72,
      voiceModel: "openai-tts",
      lastUpdated: "2024-01-10",
    },
    {
      id: "5",
      code: "zh",
      name: "Chinese",
      nativeName: "中文",
      isActive: false,
      completionRate: 45,
      lastUpdated: "2024-01-08",
    },
  ]);

  const [translations, setTranslations] = useState<Translation[]>([
    {
      key: "welcome_message",
      english: "Hello! How can I help you today?",
      translations: {
        es: "¡Hola! ¿Cómo puedo ayudarte hoy?",
        fr: "Bonjour! Comment puis-je vous aider aujourd'hui?",
        de: "Hallo! Wie kann ich Ihnen heute helfen?",
        zh: "你好！今天我能为您做些什么？",
      },
    },
    {
      key: "goodbye_message",
      english: "Thank you for using our service. Have a great day!",
      translations: {
        es: "Gracias por usar nuestro servicio. ¡Que tengas un gran día!",
        fr: "Merci d'utiliser notre service. Passez une excellente journée!",
        de: "Vielen Dank für die Nutzung unseres Services. Haben Sie einen schönen Tag!",
        zh: "感谢您使用我们的服务。祝您有美好的一天！",
      },
    },
    {
      key: "error_message",
      english:
        "I'm sorry, I didn't understand that. Could you please rephrase?",
      translations: {
        es: "Lo siento, no entendí eso. ¿Podrías reformularlo?",
        fr: "Désolé, je n'ai pas compris. Pourriez-vous reformuler?",
        de: "Entschuldigung, das habe ich nicht verstanden. Könnten Sie das umformulieren?",
        zh: "抱歉，我没有理解。您能重新表述一下吗？",
      },
    },
  ]);

  const voiceModels = [
    { value: "elevenlabs-nova", label: "ElevenLabs Nova (Premium)" },
    { value: "elevenlabs-alloy", label: "ElevenLabs Alloy" },
    { value: "google-standard", label: "Google Standard" },
    { value: "google-wavenet", label: "Google WaveNet" },
    { value: "openai-tts", label: "OpenAI TTS" },
    { value: "azure-neural", label: "Azure Neural Voice" },
  ];

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddLanguage = () => {
    if (!newLanguage.code || !newLanguage.name || !newLanguage.nativeName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const language: Language = {
      id: Date.now().toString(),
      code: newLanguage.code,
      name: newLanguage.name,
      nativeName: newLanguage.nativeName,
      isActive: false,
      completionRate: 0,
      voiceModel: newLanguage.voiceModel,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setLanguages([...languages, language]);
    setNewLanguage({ code: "", name: "", nativeName: "", voiceModel: "" });
    setIsAddLanguageOpen(false);

    toast({
      title: "Success",
      description: "Language added successfully",
    });
  };

  const handleToggleLanguage = (id: string) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, isActive: !lang.isActive } : lang,
      ),
    );

    const language = languages.find((l) => l.id === id);
    toast({
      title: language?.isActive ? "Language Disabled" : "Language Enabled",
      description: `${language?.name} has been ${language?.isActive ? "disabled" : "enabled"}`,
    });
  };

  const handleDeleteLanguage = (id: string) => {
    const language = languages.find((l) => l.id === id);
    setLanguages(languages.filter((l) => l.id !== id));
    toast({
      title: "Language Deleted",
      description: `${language?.name} has been removed`,
    });
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionBgColor = (rate: number) => {
    if (rate >= 90) return "bg-green-100";
    if (rate >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Language Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage languages, translations, and voice models for your AI
            assistant
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
          <Dialog open={isAddLanguageOpen} onOpenChange={setIsAddLanguageOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Language</DialogTitle>
                <DialogDescription>
                  Add support for a new language to your AI assistant
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Language Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., en, es, fr"
                    value={newLanguage.code}
                    onChange={(e) =>
                      setNewLanguage({ ...newLanguage, code: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">English Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Spanish, French"
                    value={newLanguage.name}
                    onChange={(e) =>
                      setNewLanguage({ ...newLanguage, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nativeName">Native Name</Label>
                  <Input
                    id="nativeName"
                    placeholder="e.g., Español, Français"
                    value={newLanguage.nativeName}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        nativeName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="voiceModel">Voice Model (Optional)</Label>
                  <Select
                    value={newLanguage.voiceModel}
                    onValueChange={(value) =>
                      setNewLanguage({ ...newLanguage, voiceModel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice model" />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddLanguageOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddLanguage}>Add Language</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search languages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Languages
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {languages.length}
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
                <p className="text-sm font-medium text-muted-foreground">
                  Active Languages
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {languages.filter((l) => l.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Translation Keys
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {translations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Volume2 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Voice Models
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {voiceModels.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="languages" className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="languages"
            className="flex items-center space-x-2"
          >
            <Languages className="h-4 w-4" />
            <span>Languages</span>
          </TabsTrigger>
          <TabsTrigger
            value="translations"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Translations</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Voice Models</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="languages" className="space-y-4">
          {/* Languages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLanguages.map((language) => (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {language.code.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {language.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {language.nativeName}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleLanguage(language.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {language.isActive ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteLanguage(language.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge
                          variant={language.isActive ? "default" : "secondary"}
                        >
                          {language.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            Completion:
                          </span>
                          <span
                            className={`font-medium ${getCompletionColor(
                              language.completionRate,
                            )}`}
                          >
                            {language.completionRate}%
                          </span>
                        </div>
                        <Progress
                          value={language.completionRate}
                          className="h-2"
                        />
                      </div>
                      {language.voiceModel && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Voice:
                          </span>
                          <span className="text-sm font-medium">
                            {voiceModels
                              .find((v) => v.value === language.voiceModel)
                              ?.label.split(" ")[0] || language.voiceModel}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Updated:
                        </span>
                        <span className="text-sm font-medium">
                          {language.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Translation Keys</CardTitle>
              <CardDescription>
                Manage text translations for different languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {translations.map((translation, index) => (
                  <motion.div
                    key={translation.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{translation.key}</h4>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          English
                        </Label>
                        <p className="text-sm">{translation.english}</p>
                      </div>
                      {Object.entries(translation.translations).map(
                        ([langCode, text]) => (
                          <div key={langCode}>
                            <Label className="text-xs text-muted-foreground">
                              {languages.find((l) => l.code === langCode)
                                ?.name || langCode}
                            </Label>
                            <p className="text-sm">{text}</p>
                          </div>
                        ),
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice Models</CardTitle>
              <CardDescription>
                Configure text-to-speech models for different languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voiceModels.map((model) => (
                  <div key={model.value} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{model.label}</h4>
                      <Volume2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Used by{" "}
                      {
                        languages.filter((l) => l.voiceModel === model.value)
                          .length
                      }{" "}
                      languages
                    </p>
                    <Button variant="outline" size="sm">
                      Test Voice
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageManager;
