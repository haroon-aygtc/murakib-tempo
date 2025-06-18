import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Globe,
  Code,
  Copy,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  Shield,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const DeployPage = () => {
  const { toast } = useToast();
  const [deploymentConfig, setDeploymentConfig] = useState({
    domain: "",
    subdomain: "my-assistant",
    environment: "production",
    autoUpdates: true,
    analytics: true,
    customCSS: "",
    allowedDomains: "",
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<
    "idle" | "deploying" | "success" | "error"
  >("idle");

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus("deploying");

    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      setDeploymentStatus("success");
      toast({
        title: "Deployment Successful!",
        description: "Your AI assistant is now live and ready to use.",
      });
    }, 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Embed code has been copied to your clipboard.",
    });
  };

  const embedCode = `<!-- Murakib AI Assistant Widget -->
<script src="https://cdn.murakib.com/widget.js"></script>
<script>
  MurakibWidget.init({
    assistantId: 'your-assistant-id',
    apiKey: 'your-api-key',
    position: 'bottom-right',
    theme: 'light'
  });
</script>`;

  const reactCode = `import { MurakibWidget } from '@murakib/react-widget';

function App() {
  return (
    <div>
      {/* Your app content */}
      <MurakibWidget
        assistantId="your-assistant-id"
        apiKey="your-api-key"
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}`;

  const deploymentSteps = [
    {
      step: "Validating configuration",
      completed: deploymentStatus !== "idle",
    },
    { step: "Building widget", completed: deploymentStatus === "success" },
    { step: "Deploying to CDN", completed: deploymentStatus === "success" },
    { step: "Configuring domains", completed: deploymentStatus === "success" },
    { step: "Running tests", completed: deploymentStatus === "success" },
  ];

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deploy Assistant</h1>
          <p className="text-gray-600 mt-1">
            Deploy your AI assistant to production and start helping users
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isDeploying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Deploy Now
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Deployment Status */}
      {deploymentStatus !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {deploymentStatus === "deploying" && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                )}
                {deploymentStatus === "success" && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
                {deploymentStatus === "error" && (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <h3 className="font-medium text-blue-900">
                    {deploymentStatus === "deploying" &&
                      "Deployment in Progress"}
                    {deploymentStatus === "success" && "Deployment Successful"}
                    {deploymentStatus === "error" && "Deployment Failed"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {deploymentStatus === "deploying" &&
                      "Please wait while we deploy your assistant..."}
                    {deploymentStatus === "success" &&
                      "Your AI assistant is now live and ready to use!"}
                    {deploymentStatus === "error" &&
                      "There was an error during deployment. Please try again."}
                  </p>
                </div>
              </div>
              {deploymentStatus === "deploying" && (
                <div className="space-y-2">
                  {deploymentSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                      )}
                      <span
                        className={`text-sm ${
                          step.completed ? "text-green-700" : "text-gray-600"
                        }`}
                      >
                        {step.step}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {deploymentStatus === "success" && (
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Live URL:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        https://{deploymentConfig.subdomain}.murakib.app
                      </code>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="config" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="embed">Embed Code</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Settings</CardTitle>
                  <CardDescription>
                    Configure how your assistant will be deployed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Subdomain</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="subdomain"
                          value={deploymentConfig.subdomain}
                          onChange={(e) =>
                            setDeploymentConfig({
                              ...deploymentConfig,
                              subdomain: e.target.value,
                            })
                          }
                        />
                        <span className="text-sm text-gray-500">
                          .murakib.app
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Environment</Label>
                      <Select
                        value={deploymentConfig.environment}
                        onValueChange={(value) =>
                          setDeploymentConfig({
                            ...deploymentConfig,
                            environment: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Updates</Label>
                        <div className="text-sm text-gray-500">
                          Automatically deploy updates when you make changes
                        </div>
                      </div>
                      <Switch
                        checked={deploymentConfig.autoUpdates}
                        onCheckedChange={(checked) =>
                          setDeploymentConfig({
                            ...deploymentConfig,
                            autoUpdates: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analytics Tracking</Label>
                        <div className="text-sm text-gray-500">
                          Enable usage analytics and performance monitoring
                        </div>
                      </div>
                      <Switch
                        checked={deploymentConfig.analytics}
                        onCheckedChange={(checked) =>
                          setDeploymentConfig({
                            ...deploymentConfig,
                            analytics: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-css">Custom CSS (Optional)</Label>
                    <Textarea
                      id="custom-css"
                      placeholder="Add custom CSS to style your widget..."
                      value={deploymentConfig.customCSS}
                      onChange={(e) =>
                        setDeploymentConfig({
                          ...deploymentConfig,
                          customCSS: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="embed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                  <CardDescription>
                    Copy and paste this code into your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>HTML/JavaScript</Label>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{embedCode}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(embedCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>React Component</Label>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{reactCode}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(reactCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download SDK
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domains" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Domain Configuration</CardTitle>
                  <CardDescription>
                    Configure which domains can use your assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allowed-domains">Allowed Domains</Label>
                    <Textarea
                      id="allowed-domains"
                      placeholder="example.com\napp.example.com\n*.example.com"
                      value={deploymentConfig.allowedDomains}
                      onChange={(e) =>
                        setDeploymentConfig({
                          ...deploymentConfig,
                          allowedDomains: e.target.value,
                        })
                      }
                      rows={4}
                    />
                    <p className="text-sm text-gray-500">
                      Enter one domain per line. Use * for wildcards. Leave
                      empty to allow all domains.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Domain (Pro)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="assistant.yourdomain.com"
                        value={deploymentConfig.domain}
                        onChange={(e) =>
                          setDeploymentConfig({
                            ...deploymentConfig,
                            domain: e.target.value,
                          })
                        }
                      />
                      <Button variant="outline">Configure</Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Use your own domain for the assistant. Requires Pro plan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Deployment Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deployment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge
                  variant={
                    deploymentStatus === "success"
                      ? "default"
                      : deploymentStatus === "error"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {deploymentStatus === "idle" && "Not Deployed"}
                  {deploymentStatus === "deploying" && "Deploying"}
                  {deploymentStatus === "success" && "Live"}
                  {deploymentStatus === "error" && "Failed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Environment:</span>
                <span className="text-sm font-medium capitalize">
                  {deploymentConfig.environment}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Deploy:</span>
                <span className="text-sm font-medium">
                  {deploymentStatus === "success" ? "Just now" : "Never"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto Updates:</span>
                <span className="text-sm font-medium">
                  {deploymentConfig.autoUpdates ? "Enabled" : "Disabled"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                Manage API Keys
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Performance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                CDN Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Compatibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Desktop</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tablet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Tablet</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Mobile</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeployPage;
