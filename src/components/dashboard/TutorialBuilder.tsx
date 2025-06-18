import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Edit,
  Trash2,
  Move,
  Eye,
  Save,
  BookOpen,
  MousePointer,
  MessageSquare,
  Volume2,
  Target,
  ArrowRight,
  Settings,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  element: string;
  position: "top" | "bottom" | "left" | "right";
  action: "click" | "hover" | "focus" | "none";
  voiceEnabled: boolean;
  voiceText?: string;
  delay: number;
}

interface Tutorial {
  id: string;
  name: string;
  description: string;
  steps: TutorialStep[];
  isActive: boolean;
}

const TutorialBuilder = () => {
  const { toast } = useToast();
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<TutorialStep | null>(null);

  const [newStep, setNewStep] = useState<Partial<TutorialStep>>({
    title: "",
    description: "",
    element: "",
    position: "bottom",
    action: "click",
    voiceEnabled: false,
    voiceText: "",
    delay: 1000,
  });

  // Mock tutorials data
  const [tutorials, setTutorials] = useState<Tutorial[]>([
    {
      id: "1",
      name: "Form Completion Guide",
      description: "Step-by-step guide for filling out the contact form",
      isActive: true,
      steps: [
        {
          id: "1",
          title: "Enter Your Name",
          description: "Click on the name field and enter your full name",
          element: "#name-field",
          position: "bottom",
          action: "click",
          voiceEnabled: true,
          voiceText: "Please enter your full name in this field",
          delay: 1000,
        },
        {
          id: "2",
          title: "Enter Email Address",
          description: "Provide a valid email address for contact",
          element: "#email-field",
          position: "bottom",
          action: "click",
          voiceEnabled: true,
          voiceText: "Enter your email address here",
          delay: 1500,
        },
        {
          id: "3",
          title: "Submit Form",
          description: "Click the submit button to send your information",
          element: "#submit-button",
          position: "top",
          action: "click",
          voiceEnabled: true,
          voiceText: "Click here to submit your form",
          delay: 2000,
        },
      ],
    },
    {
      id: "2",
      name: "Navigation Tutorial",
      description: "Learn how to navigate through the application",
      isActive: false,
      steps: [],
    },
  ]);

  const handleCreateStep = () => {
    if (!newStep.title || !newStep.element) {
      toast({
        title: "Error",
        description: "Title and element selector are required",
        variant: "destructive",
      });
      return;
    }

    const step: TutorialStep = {
      id: Date.now().toString(),
      title: newStep.title!,
      description: newStep.description || "",
      element: newStep.element!,
      position: newStep.position || "bottom",
      action: newStep.action || "click",
      voiceEnabled: newStep.voiceEnabled || false,
      voiceText: newStep.voiceText || "",
      delay: newStep.delay || 1000,
    };

    if (currentTutorial) {
      const updatedTutorial = {
        ...currentTutorial,
        steps: [...currentTutorial.steps, step],
      };
      setCurrentTutorial(updatedTutorial);
      setTutorials(
        tutorials.map((t) =>
          t.id === currentTutorial.id ? updatedTutorial : t,
        ),
      );
    }

    setNewStep({
      title: "",
      description: "",
      element: "",
      position: "bottom",
      action: "click",
      voiceEnabled: false,
      voiceText: "",
      delay: 1000,
    });
    setIsStepDialogOpen(false);

    toast({
      title: "Success",
      description: "Tutorial step created successfully",
    });
  };

  const handleDeleteStep = (stepId: string) => {
    if (currentTutorial) {
      const updatedTutorial = {
        ...currentTutorial,
        steps: currentTutorial.steps.filter((s) => s.id !== stepId),
      };
      setCurrentTutorial(updatedTutorial);
      setTutorials(
        tutorials.map((t) =>
          t.id === currentTutorial.id ? updatedTutorial : t,
        ),
      );

      toast({
        title: "Success",
        description: "Tutorial step deleted successfully",
      });
    }
  };

  const handlePlayTutorial = () => {
    setIsPlaying(true);
    setCurrentStepIndex(0);
    toast({
      title: "Tutorial Started",
      description: "Playing tutorial from the beginning",
    });
  };

  const handleStopTutorial = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (
      currentTutorial &&
      currentStepIndex < currentTutorial.steps.length - 1
    ) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStep = currentTutorial?.steps[currentStepIndex];

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutorial Builder</h1>
          <p className="text-gray-600 mt-1">
            Create step-by-step interactive tutorials for your users
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Tutorial
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tutorial List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tutorials</CardTitle>
              <CardDescription>Select a tutorial to edit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {tutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentTutorial?.id === tutorial.id
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCurrentTutorial(tutorial)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{tutorial.name}</div>
                      <div className="text-xs text-gray-500">
                        {tutorial.steps.length} steps
                      </div>
                    </div>
                    <Badge
                      variant={tutorial.isActive ? "default" : "secondary"}
                    >
                      {tutorial.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {currentTutorial ? (
            <>
              {/* Tutorial Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentTutorial.name}</CardTitle>
                      <CardDescription>
                        {currentTutorial.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isPlaying ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevStep}
                            disabled={currentStepIndex === 0}
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleStopTutorial}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextStep}
                            disabled={
                              currentStepIndex >=
                              currentTutorial.steps.length - 1
                            }
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handlePlayTutorial}
                          disabled={currentTutorial.steps.length === 0}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Tutorial
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Current Step Preview */}
              {isPlaying && currentStep && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {currentStepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-purple-900">
                            {currentStep.title}
                          </h3>
                          <p className="text-sm text-purple-700">
                            {currentStep.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-purple-600">
                            <span className="flex items-center">
                              <Target className="h-3 w-3 mr-1" />
                              {currentStep.element}
                            </span>
                            <span className="flex items-center">
                              <MousePointer className="h-3 w-3 mr-1" />
                              {currentStep.action}
                            </span>
                            {currentStep.voiceEnabled && (
                              <span className="flex items-center">
                                <Volume2 className="h-3 w-3 mr-1" />
                                Voice
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Steps List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Tutorial Steps</CardTitle>
                    <Dialog
                      open={isStepDialogOpen}
                      onOpenChange={setIsStepDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Step
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Create Tutorial Step</DialogTitle>
                          <DialogDescription>
                            Define a new step in your tutorial sequence
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="step-title">Title</Label>
                            <Input
                              id="step-title"
                              placeholder="Enter step title"
                              value={newStep.title}
                              onChange={(e) =>
                                setNewStep({
                                  ...newStep,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="step-description">
                              Description
                            </Label>
                            <Textarea
                              id="step-description"
                              placeholder="Describe what the user should do"
                              value={newStep.description}
                              onChange={(e) =>
                                setNewStep({
                                  ...newStep,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="step-element">
                              Element Selector
                            </Label>
                            <Input
                              id="step-element"
                              placeholder="#element-id or .class-name"
                              value={newStep.element}
                              onChange={(e) =>
                                setNewStep({
                                  ...newStep,
                                  element: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Position</Label>
                              <Select
                                value={newStep.position}
                                onValueChange={(value: any) =>
                                  setNewStep({ ...newStep, position: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="top">Top</SelectItem>
                                  <SelectItem value="bottom">Bottom</SelectItem>
                                  <SelectItem value="left">Left</SelectItem>
                                  <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>Action</Label>
                              <Select
                                value={newStep.action}
                                onValueChange={(value: any) =>
                                  setNewStep({ ...newStep, action: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="click">Click</SelectItem>
                                  <SelectItem value="hover">Hover</SelectItem>
                                  <SelectItem value="focus">Focus</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="voice-enabled"
                              checked={newStep.voiceEnabled}
                              onCheckedChange={(checked) =>
                                setNewStep({
                                  ...newStep,
                                  voiceEnabled: checked,
                                })
                              }
                            />
                            <Label htmlFor="voice-enabled">
                              Enable voice narration
                            </Label>
                          </div>
                          {newStep.voiceEnabled && (
                            <div className="grid gap-2">
                              <Label htmlFor="voice-text">Voice Text</Label>
                              <Textarea
                                id="voice-text"
                                placeholder="Text to be spoken for this step"
                                value={newStep.voiceText}
                                onChange={(e) =>
                                  setNewStep({
                                    ...newStep,
                                    voiceText: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsStepDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateStep}>
                            Create Step
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {currentTutorial.steps.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No steps yet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Create your first tutorial step to get started
                      </p>
                      <Button onClick={() => setIsStepDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Step
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentTutorial.steps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          className={`p-4 border rounded-lg ${
                            isPlaying && index === currentStepIndex
                              ? "border-purple-200 bg-purple-50"
                              : "border-gray-200"
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                isPlaying && index === currentStepIndex
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{step.title}</h4>
                                <div className="flex items-center space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Move className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteStep(step.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {step.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {step.element}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {step.action}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {step.position}
                                </Badge>
                                {step.voiceEnabled && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs flex items-center"
                                  >
                                    <Volume2 className="h-3 w-3 mr-1" />
                                    Voice
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {index < currentTutorial.steps.length - 1 && (
                            <div className="flex justify-center mt-4">
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Tutorial
                </h3>
                <p className="text-gray-500">
                  Choose a tutorial from the list to start editing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialBuilder;
