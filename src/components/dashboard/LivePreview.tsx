import React from "react";
import { Eye, Monitor, Smartphone, Tablet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWidgetConfig } from "@/contexts/WidgetConfigContext";
import AIAssistantWidget from "@/components/AIAssistantWidget";

interface LivePreviewProps {
  className?: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ className = "" }) => {
  const { config } = useWidgetConfig();
  const [previewDevice, setPreviewDevice] = React.useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const deviceSizes = {
    desktop: { width: "100%", height: "600px" },
    tablet: { width: "768px", height: "500px" },
    mobile: { width: "375px", height: "400px" },
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Live Preview</span>
              </CardTitle>
              <CardDescription>
                See how your widget will appear to users in real-time
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                {["desktop", "tablet", "mobile"].map((device) => (
                  <TooltipProvider key={device}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            previewDevice === device ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setPreviewDevice(device as any)}
                          className="h-8 w-8 p-0"
                        >
                          {getDeviceIcon(device)}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="capitalize">{device} preview</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`bg-muted/30 rounded-lg p-4 relative overflow-hidden transition-all duration-300 ${
              isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
            }`}
            style={{
              minHeight: isFullscreen
                ? "100vh"
                : deviceSizes[previewDevice].height,
              maxWidth: isFullscreen
                ? "100%"
                : deviceSizes[previewDevice].width,
              margin: isFullscreen ? "0" : "0 auto",
            }}
          >
            {/* Mock Website Background */}
            <div className="bg-card rounded shadow-sm p-4 mb-4 h-full">
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-muted/50 rounded p-4">
                    <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-2 bg-muted rounded mb-1"></div>
                    <div className="h-2 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="bg-muted/50 rounded p-4">
                    <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-2 bg-muted rounded mb-1"></div>
                    <div className="h-2 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Widget Preview */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full pointer-events-auto">
                <AIAssistantWidget
                  position={config.position}
                  primaryColor={config.primaryColor}
                  assistantName={config.name}
                  assistantAvatar={config.avatar}
                  defaultLanguage={config.language}
                  voiceEnabled={config.voiceEnabled}
                  formInteractionEnabled={config.formGuidanceEnabled}
                  tutorialMode={false}
                />
              </div>
            </div>

            {isFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 z-10"
              >
                Exit Fullscreen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
          <CardDescription>Current widget settings overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Name:</span>
                <Badge variant="outline">{config.name}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Position:</span>
                <Badge variant="outline" className="capitalize">
                  {config.position.replace("-", " ")}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Size:</span>
                <Badge variant="outline" className="capitalize">
                  {config.size}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Language:</span>
                <Badge variant="outline">{config.language.toUpperCase()}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Voice:</span>
                <Badge variant={config.voiceEnabled ? "default" : "secondary"}>
                  {config.voiceEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Chat:</span>
                <Badge variant={config.chatEnabled ? "default" : "secondary"}>
                  {config.chatEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  AI Provider:
                </span>
                <Badge variant="outline" className="capitalize">
                  {config.aiProvider}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Model:</span>
                <Badge variant="outline">{config.aiModel}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePreview;
