import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextualGuidanceProps {
  isVisible?: boolean;
  targetElement?: HTMLElement | null;
  guidanceType?: "tooltip" | "pointer" | "highlight";
  content?: {
    title?: string;
    description?: string;
    suggestions?: string[];
  };
  position?: "top" | "right" | "bottom" | "left";
  status?: "info" | "warning" | "success" | "error";
  onClose?: () => void;
}

const ContextualGuidance = ({
  isVisible = false,
  targetElement = null,
  guidanceType = "tooltip",
  content = {
    title: "Field Guidance",
    description: "This is a helpful tip about this field.",
    suggestions: ["Suggestion 1", "Suggestion 2"],
  },
  position = "bottom",
  status = "info",
  onClose = () => {},
}: ContextualGuidanceProps) => {
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (targetElement && isVisible) {
      const updatePosition = () => {
        const rect = targetElement.getBoundingClientRect();
        setCoords({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [targetElement, isVisible]);

  const getPositionStyles = () => {
    const gap = 8; // Gap between target element and guidance

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
      case "bottom":
      default:
        return {
          top: coords.y + coords.height + gap,
          left: coords.x + coords.width / 2,
          transform: "translateX(-50%)",
        };
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "info":
      default:
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "warning":
        return "border-amber-200 bg-amber-50";
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "info":
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const renderGuidance = () => {
    switch (guidanceType) {
      case "pointer":
        return (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              top: coords.y + coords.height / 2,
              left: coords.x + coords.width / 2,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-6 h-6 rounded-full bg-blue-500 animate-ping opacity-75"
            />
            <div className="w-3 h-3 rounded-full bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        );

      case "highlight":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-40 pointer-events-none"
            style={{
              top: coords.y,
              left: coords.x,
              width: coords.width,
              height: coords.height,
              boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.5)",
              borderRadius: "4px",
            }}
          />
        );

      case "tooltip":
      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "absolute z-50 w-64 p-3 rounded-lg shadow-lg border",
              getStatusColor(),
            )}
            style={getPositionStyles()}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-2 items-center">
                {getStatusIcon()}
                <h3 className="font-medium text-sm">{content.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close guidance"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {content.description && (
              <p className="mt-1 text-xs text-gray-600">
                {content.description}
              </p>
            )}

            {content.suggestions && content.suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700">
                  Suggestions:
                </p>
                <ul className="mt-1 space-y-1">
                  {content.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="text-xs bg-white rounded px-2 py-1 border border-gray-200 cursor-pointer hover:bg-gray-50"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Arrow pointing to the target element */}
            <div
              className={cn("absolute w-2 h-2 rotate-45", getStatusColor(), {
                "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2":
                  position === "bottom",
                "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2":
                  position === "top",
                "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2":
                  position === "right",
                "right-0 top-1/2 translate-x-1/2 -translate-y-1/2":
                  position === "left",
              })}
            />
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && targetElement && renderGuidance()}
    </AnimatePresence>
  );
};

export default ContextualGuidance;
