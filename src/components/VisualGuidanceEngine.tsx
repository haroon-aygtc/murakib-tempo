import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  MousePointer,
  Eye,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VisualGuidanceProps {
  isActive?: boolean;
  targetSelector?: string;
  guidanceType?: "highlight" | "pointer" | "tooltip" | "spotlight" | "pulse";
  message?: string;
  position?: "top" | "right" | "bottom" | "left" | "center";
  intensity?: "subtle" | "medium" | "strong";
  onComplete?: () => void;
  autoAdvance?: boolean;
  delay?: number;
}

interface GuidanceStep {
  id: string;
  selector: string;
  type: "highlight" | "pointer" | "tooltip" | "spotlight" | "pulse";
  message: string;
  position: "top" | "right" | "bottom" | "left" | "center";
  action?: "click" | "hover" | "focus" | "scroll";
  waitForAction?: boolean;
  delay?: number;
}

interface VisualGuidanceEngineProps {
  steps?: GuidanceStep[];
  isActive?: boolean;
  onComplete?: () => void;
  onStepComplete?: (stepId: string) => void;
  autoAdvance?: boolean;
  showProgress?: boolean;
}

// Individual Guidance Component
const VisualGuidance: React.FC<VisualGuidanceProps> = ({
  isActive = false,
  targetSelector = "",
  guidanceType = "highlight",
  message = "",
  position = "bottom",
  intensity = "medium",
  onComplete = () => {},
  autoAdvance = false,
  delay = 0,
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find and track target element
  useEffect(() => {
    if (!isActive || !targetSelector) return;

    const findElement = () => {
      const element = document.querySelector(targetSelector) as HTMLElement;
      if (element) {
        setTargetElement(element);
        updatePosition(element);

        if (delay > 0) {
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
          }, delay);
        } else {
          setIsVisible(true);
        }
      }
    };

    // Try to find element immediately
    findElement();

    // If not found, try again after a short delay
    const retryTimeout = setTimeout(findElement, 100);

    return () => {
      clearTimeout(retryTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, targetSelector, delay]);

  // Update position when element changes or window resizes
  const updatePosition = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setCoords({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useEffect(() => {
    if (!targetElement) return;

    const handleResize = () => updatePosition(targetElement);
    const handleScroll = () => updatePosition(targetElement);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [targetElement, updatePosition]);

  // Auto-advance logic
  useEffect(() => {
    if (autoAdvance && isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // Auto-advance after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [autoAdvance, isVisible, onComplete]);

  if (!isActive || !isVisible || !targetElement) return null;

  const getIntensityStyles = () => {
    switch (intensity) {
      case "subtle":
        return {
          highlight: "ring-2 ring-blue-300 ring-opacity-50",
          spotlight: "bg-black bg-opacity-20",
          pulse: "animate-pulse",
        };
      case "strong":
        return {
          highlight: "ring-4 ring-blue-500 ring-opacity-80 shadow-2xl",
          spotlight: "bg-black bg-opacity-60",
          pulse: "animate-bounce",
        };
      default: // medium
        return {
          highlight: "ring-3 ring-blue-400 ring-opacity-60 shadow-lg",
          spotlight: "bg-black bg-opacity-40",
          pulse: "animate-pulse",
        };
    }
  };

  const intensityStyles = getIntensityStyles();

  const renderGuidance = () => {
    switch (guidanceType) {
      case "highlight":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              "absolute pointer-events-none rounded-lg",
              intensityStyles.highlight,
            )}
            style={{
              top: coords.y - 4,
              left: coords.x - 4,
              width: coords.width + 8,
              height: coords.height + 8,
            }}
          />
        );

      case "pointer":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute z-50 pointer-events-none"
            style={{
              top: coords.y + coords.height / 2,
              left: coords.x + coords.width / 2,
            }}
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-8 h-8 rounded-full bg-red-500 opacity-75"
              />
              <Target className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-white" />
            </div>
          </motion.div>
        );

      case "spotlight":
        return (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "fixed inset-0 z-40 pointer-events-none",
                intensityStyles.spotlight,
              )}
              style={{
                clipPath: `polygon(0% 0%, 0% 100%, ${coords.x}px 100%, ${coords.x}px ${coords.y}px, ${coords.x + coords.width}px ${coords.y}px, ${coords.x + coords.width}px ${coords.y + coords.height}px, ${coords.x}px ${coords.y + coords.height}px, ${coords.x}px 100%, 100% 100%, 100% 0%)`,
              }}
            />
            {/* Spotlight ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute z-50 pointer-events-none ring-4 ring-yellow-400 ring-opacity-80 rounded-lg"
              style={{
                top: coords.y - 8,
                left: coords.x - 8,
                width: coords.width + 16,
                height: coords.height + 16,
              }}
            />
          </>
        );

      case "pulse":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute z-50 pointer-events-none rounded-lg border-4 border-green-400",
              intensityStyles.pulse,
            )}
            style={{
              top: coords.y - 4,
              left: coords.x - 4,
              width: coords.width + 8,
              height: coords.height + 8,
            }}
          />
        );

      case "tooltip":
      default:
        const getTooltipPosition = () => {
          const gap = 12;
          switch (position) {
            case "top":
              return {
                top: coords.y - gap,
                left: coords.x + coords.width / 2,
                transform: "translate(-50%, -100%)",
              };
            case "right":
              return {
                top: coords.y + coords.height / 2,
                left: coords.x + coords.width + gap,
                transform: "translateY(-50%)",
              };
            case "left":
              return {
                top: coords.y + coords.height / 2,
                left: coords.x - gap,
                transform: "translate(-100%, -50%)",
              };
            case "center":
              return {
                top: coords.y + coords.height / 2,
                left: coords.x + coords.width / 2,
                transform: "translate(-50%, -50%)",
              };
            default: // bottom
              return {
                top: coords.y + coords.height + gap,
                left: coords.x + coords.width / 2,
                transform: "translateX(-50%)",
              };
          }
        };

        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 max-w-xs p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl pointer-events-auto"
            style={getTooltipPosition()}
          >
            <div className="flex items-start space-x-2">
              <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p>{message}</p>
                {!autoAdvance && (
                  <button
                    onClick={onComplete}
                    className="mt-2 text-xs text-blue-300 hover:text-blue-200 underline"
                  >
                    Got it
                  </button>
                )}
              </div>
            </div>
            {/* Arrow */}
            <div
              className={cn(
                "absolute w-2 h-2 bg-gray-900 rotate-45",
                position === "bottom" &&
                  "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                position === "top" &&
                  "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                position === "left" &&
                  "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
                position === "right" &&
                  "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
              )}
            />
          </motion.div>
        );
    }
  };

  return <AnimatePresence>{renderGuidance()}</AnimatePresence>;
};

// Main Visual Guidance Engine
const VisualGuidanceEngine: React.FC<VisualGuidanceEngineProps> = ({
  steps = [],
  isActive = false,
  onComplete = () => {},
  onStepComplete = () => {},
  autoAdvance = false,
  showProgress = true,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isEngineActive, setIsEngineActive] = useState(isActive);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    setIsEngineActive(isActive);
    if (isActive) {
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
    }
  }, [isActive]);

  const handleStepComplete = useCallback(() => {
    if (!currentStep) return;

    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(currentStep.id);
    setCompletedSteps(newCompletedSteps);

    onStepComplete(currentStep.id);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // All steps completed
      setIsEngineActive(false);
      onComplete();
    }
  }, [
    currentStep,
    currentStepIndex,
    steps.length,
    completedSteps,
    onStepComplete,
    onComplete,
  ]);

  // Handle action-based step completion
  useEffect(() => {
    if (!currentStep || !currentStep.waitForAction || !isEngineActive) return;

    const targetElement = document.querySelector(currentStep.selector);
    if (!targetElement) return;

    const handleAction = () => {
      handleStepComplete();
    };

    switch (currentStep.action) {
      case "click":
        targetElement.addEventListener("click", handleAction);
        break;
      case "hover":
        targetElement.addEventListener("mouseenter", handleAction);
        break;
      case "focus":
        targetElement.addEventListener("focus", handleAction);
        break;
      case "scroll":
        window.addEventListener("scroll", handleAction);
        break;
    }

    return () => {
      switch (currentStep.action) {
        case "click":
          targetElement.removeEventListener("click", handleAction);
          break;
        case "hover":
          targetElement.removeEventListener("mouseenter", handleAction);
          break;
        case "focus":
          targetElement.removeEventListener("focus", handleAction);
          break;
        case "scroll":
          window.removeEventListener("scroll", handleAction);
          break;
      }
    };
  }, [currentStep, isEngineActive, handleStepComplete]);

  if (!isEngineActive || !currentStep) return null;

  return (
    <>
      {/* Progress Indicator */}
      {showProgress && steps.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-3 border"
        >
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Current Step Guidance */}
      <VisualGuidance
        isActive={true}
        targetSelector={currentStep.selector}
        guidanceType={currentStep.type}
        message={currentStep.message}
        position={currentStep.position}
        onComplete={handleStepComplete}
        autoAdvance={autoAdvance && !currentStep.waitForAction}
        delay={currentStep.delay || 0}
      />
    </>
  );
};

export { VisualGuidance, VisualGuidanceEngine };
export type { VisualGuidanceProps, VisualGuidanceEngineProps, GuidanceStep };
