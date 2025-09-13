import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Shield, Clock, Globe, Satellite, Sun, Radio, AlertTriangle } from "lucide-react";

export const Documentation = () => {
  const dataSources = [
    {
      name: "NASA DONKI",
      description: "Space Weather Database Of Notifications, Knowledge, Information",
      icon: <Satellite className="h-5 w-5" />,
      coverage: "Solar flares, CMEs, geomagnetic storms",
      updateFrequency: "Real-time",
      reliability: "99.9%"
    },
    {
      name: "NOAA SWPC",
      description: "Space Weather Prediction Center",
      icon: <Sun className="h-5 w-5" />,
      coverage: "Forecasts, alerts, current conditions",
      updateFrequency: "Every 15 minutes",
      reliability: "99.8%"
    },
    {
      name: "ESA Space Weather",
      description: "European Space Agency monitoring network",
      icon: <Globe className="h-5 w-5" />,
      coverage: "European monitoring stations",
      updateFrequency: "Every 30 minutes",
      reliability: "99.7%"
    },
    {
      name: "Global Magnetometer Network",
      description: "Worldwide magnetic field monitoring",
      icon: <Radio className="h-5 w-5" />,
      coverage: "Geomagnetic field measurements",
      updateFrequency: "Every 1 minute",
      reliability: "99.9%"
    }
  ];

  const dataSchema = {
    solarFlares: {
      fields: [
        { name: "id", type: "string", description: "Unique identifier for the solar flare event" },
        { name: "date", type: "string", description: "Date of occurrence (ISO 8601)" },
        { name: "time", type: "string", description: "Time of occurrence (UTC)" },
        { name: "class", type: "string", description: "Flare classification (A, B, C, M, X)" },
        { name: "region", type: "string", description: "Active region identifier" },
        { name: "peak", type: "string", description: "Peak intensity time (UTC)" },
        { name: "intensity", type: "number", description: "Relative intensity (1-100)" },
        { name: "longitude", type: "number", description: "Heliographic longitude" },
        { name: "latitude", type: "number", description: "Heliographic latitude" }
      ]
    },
    geomagneticActivity: {
      fields: [
        { name: "date", type: "string", description: "Measurement date (ISO 8601)" },
        { name: "kIndex", type: "number", description: "K-index value (0-9)" },
        { name: "apIndex", type: "number", description: "Ap index value" },
        { name: "classification", type: "string", description: "Activity level classification" },
        { name: "forecast", type: "string", description: "Trend forecast" },
        { name: "disturbanceLevel", type: "number", description: "Disturbance severity (1-10)" }
      ]
    },
    spaceWeatherAlerts: {
      fields: [
        { name: "id", type: "string", description: "Unique alert identifier" },
        { name: "type", type: "string", description: "Alert category" },
        { name: "level", type: "string", description: "Severity level (LOW, MODERATE, HIGH, SEVERE, EXTREME)" },
        { name: "description", type: "string", description: "Human-readable alert description" },
        { name: "issued", type: "string", description: "Alert issue timestamp (ISO 8601)" },
        { name: "expires", type: "string", description: "Alert expiration timestamp (ISO 8601)" },
        { name: "affectedSystems", type: "array", description: "List of potentially affected systems" }
      ]
    }
  };

  return (
    <section id="docs" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Documentation & Data Sources
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comprehensive documentation for our space weather data platform, including data sources, 
            schemas, and integration guides.
          </p>
        </div>

        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="schema">Data Schema</TabsTrigger>
            <TabsTrigger value="integration">Integration Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataSources.map((source, index) => (
                <Card key={index} className="p-6 shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-space-primary/10 rounded-lg text-space-primary">
                        {source.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-space-secondary/20 text-space-secondary">
                      {source.reliability}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Coverage:</span>
                      <span className="text-sm text-foreground">{source.coverage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Update Frequency:</span>
                      <span className="text-sm text-foreground">{source.updateFrequency}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Card className="mt-8 p-6 shadow-card bg-gradient-space text-primary-foreground">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-semibold">Data Quality Assurance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="font-semibold">Real-time Processing</div>
                  <div className="text-sm opacity-80">Data processed within seconds of receipt</div>
                </div>
                <div className="text-center">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="font-semibold">99.9% Accuracy</div>
                  <div className="text-sm opacity-80">Automated validation and quality checks</div>
                </div>
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="font-semibold">Redundant Sources</div>
                  <div className="text-sm opacity-80">Multiple source validation for critical events</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schema">
            <div className="space-y-6">
              {Object.entries(dataSchema).map(([category, schema]) => (
                <Card key={category} className="p-6 shadow-card">
                  <h3 className="text-xl font-semibold text-foreground mb-4 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-2 text-muted-foreground font-semibold">Field</th>
                          <th className="text-left p-2 text-muted-foreground font-semibold">Type</th>
                          <th className="text-left p-2 text-muted-foreground font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schema.fields.map((field, index) => (
                          <tr key={index} className="border-b border-border/50">
                            <td className="p-2">
                              <code className="text-space-primary bg-muted px-2 py-1 rounded text-xs">
                                {field.name}
                              </code>
                            </td>
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs">
                                {field.type}
                              </Badge>
                            </td>
                            <td className="p-2 text-muted-foreground">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integration">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 shadow-card">
                <h3 className="text-xl font-semibold text-foreground mb-4">Quick Start Guide</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="bg-space-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                    <div>
                      <strong>Sign up</strong> for a SpaceWeatherPro account and get your API key
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-space-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                    <div>
                      <strong>Authenticate</strong> your requests using the Bearer token method
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-space-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                    <div>
                      <strong>Make requests</strong> to our RESTful API endpoints
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-space-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                    <div>
                      <strong>Process data</strong> in JSON format or export to CSV/XML
                    </div>
                  </li>
                </ol>
              </Card>

              <Card className="p-6 shadow-card">
                <h3 className="text-xl font-semibold text-foreground mb-4">Rate Limits & Quotas</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Starter Plan</span>
                    <Badge>10 req/min</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Professional Plan</span>
                    <Badge>100 req/min</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Enterprise Plan</span>
                    <Badge>Unlimited</Badge>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-space-primary/10 rounded border border-space-primary/20">
                  <p className="text-xs text-space-primary">
                    <strong>Note:</strong> Rate limits are per API key. Contact support for higher limits or burst capacity.
                  </p>
                </div>
              </Card>

              <Card className="p-6 shadow-card lg:col-span-2">
                <h3 className="text-xl font-semibold text-foreground mb-4">Best Practices</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 text-xs">✓</Badge>
                      <span>Cache responses when appropriate to reduce API calls</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 text-xs">✓</Badge>
                      <span>Implement exponential backoff for failed requests</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 text-xs">✓</Badge>
                      <span>Use webhooks for real-time alert notifications</span>
                    </li>
                  </ul>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 text-xs">✓</Badge>
                      <span>Monitor your quota usage through the dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 text-xs">✓</Badge>
                      <span>Use appropriate date ranges for historical data</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 text-xs">✓</Badge>
                      <span>Validate data integrity in critical applications</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};