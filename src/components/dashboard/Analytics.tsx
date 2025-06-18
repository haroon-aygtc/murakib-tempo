import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  Globe,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("interactions");

  // Mock data
  const stats = {
    totalInteractions: 12847,
    activeUsers: 3421,
    avgResponseTime: 1.2,
    satisfactionRate: 94.8,
    trendsData: {
      interactions: { value: 12847, change: 15.3, trend: "up" },
      users: { value: 3421, change: -2.1, trend: "down" },
      responseTime: { value: 1.2, change: -8.7, trend: "up" },
      satisfaction: { value: 94.8, change: 3.2, trend: "up" },
    },
  };

  const languageStats = [
    { language: "English", usage: 68, interactions: 8736 },
    { language: "Spanish", usage: 15, interactions: 1927 },
    { language: "French", usage: 8, interactions: 1028 },
    { language: "German", usage: 5, interactions: 642 },
    { language: "Other", usage: 4, interactions: 514 },
  ];

  const assistantPerformance = [
    {
      name: "Customer Support Bot",
      interactions: 5432,
      satisfaction: 96.2,
      avgResponseTime: 0.9,
    },
    {
      name: "Multilingual Guide",
      interactions: 3891,
      satisfaction: 94.1,
      avgResponseTime: 1.3,
    },
    {
      name: "Form Assistant",
      interactions: 2156,
      satisfaction: 92.8,
      avgResponseTime: 1.1,
    },
    {
      name: "Navigation Helper",
      interactions: 1368,
      satisfaction: 95.5,
      avgResponseTime: 0.8,
    },
  ];

  const timeRangeOptions = [
    { value: "1d", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Monitor your AI assistant performance and user engagement
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Interactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalInteractions.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {getTrendIcon(stats.trendsData.interactions.trend)}
                <span
                  className={`ml-1 font-medium ${getTrendColor(
                    stats.trendsData.interactions.trend,
                  )}`}
                >
                  {stats.trendsData.interactions.change > 0 ? "+" : ""}
                  {stats.trendsData.interactions.change}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {getTrendIcon(stats.trendsData.users.trend)}
                <span
                  className={`ml-1 font-medium ${getTrendColor(
                    stats.trendsData.users.trend,
                  )}`}
                >
                  {stats.trendsData.users.change > 0 ? "+" : ""}
                  {stats.trendsData.users.change}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgResponseTime}s
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {getTrendIcon(stats.trendsData.responseTime.trend)}
                <span
                  className={`ml-1 font-medium ${getTrendColor(
                    stats.trendsData.responseTime.trend,
                  )}`}
                >
                  {stats.trendsData.responseTime.change > 0 ? "+" : ""}
                  {stats.trendsData.responseTime.change}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Satisfaction Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.satisfactionRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {getTrendIcon(stats.trendsData.satisfaction.trend)}
                <span
                  className={`ml-1 font-medium ${getTrendColor(
                    stats.trendsData.satisfaction.trend,
                  )}`}
                >
                  {stats.trendsData.satisfaction.change > 0 ? "+" : ""}
                  {stats.trendsData.satisfaction.change}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assistants">Assistants</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interaction Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Interactions Over Time</CardTitle>
                <CardDescription>
                  Daily interaction volume for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm">
                      Integration with charting library needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>
                  Average response time over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-2" />
                    <p>Response time chart would appear here</p>
                    <p className="text-sm">
                      Integration with charting library needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assistants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assistant Performance</CardTitle>
              <CardDescription>
                Compare performance metrics across your AI assistants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assistantPerformance.map((assistant, index) => (
                  <motion.div
                    key={assistant.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{assistant.name}</h4>
                      <Badge variant="secondary">
                        {assistant.interactions.toLocaleString()} interactions
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Satisfaction Rate</span>
                          <span className="font-medium">
                            {assistant.satisfaction}%
                          </span>
                        </div>
                        <Progress
                          value={assistant.satisfaction}
                          className="h-2"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Avg Response Time
                        </span>
                        <span className="text-sm font-medium">
                          {assistant.avgResponseTime}s
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language Usage</CardTitle>
              <CardDescription>
                Distribution of interactions by language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languageStats.map((lang, index) => (
                  <motion.div
                    key={lang.language}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{lang.language}</p>
                        <p className="text-sm text-gray-500">
                          {lang.interactions.toLocaleString()} interactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{lang.usage}%</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${lang.usage}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>
                  User activity and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Users</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Returning Users
                    </span>
                    <span className="font-medium">2,174</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Avg Session Duration
                    </span>
                    <span className="font-medium">4m 32s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bounce Rate</span>
                    <span className="font-medium">23.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  User locations and regional usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Globe className="h-12 w-12 mx-auto mb-2" />
                    <p>World map visualization would appear here</p>
                    <p className="text-sm">
                      Geographic data visualization needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
