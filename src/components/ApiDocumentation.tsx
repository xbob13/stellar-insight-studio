import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Play, Book, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ApiDocumentation = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/solar-flares",
      description: "Retrieve recent solar flare activity data",
      response: {
        id: "flare-123",
        date: "2024-01-15",
        time: "14:30",
        class: "M5.2",
        region: "AR3529",
        peak: "14:45",
        intensity: 85
      }
    },
    {
      method: "GET",
      path: "/api/v1/geomagnetic",
      description: "Get current geomagnetic field measurements",
      response: {
        date: "2024-01-15",
        kIndex: 4,
        apIndex: 67,
        classification: "Active",
        forecast: "Increasing"
      }
    },
    {
      method: "GET",
      path: "/api/v1/alerts",
      description: "Fetch active space weather alerts and warnings",
      response: {
        id: "alert-456",
        type: "Solar Flare",
        level: "MODERATE",
        description: "M-class solar flare detected",
        issued: "2024-01-15T14:30:00Z",
        expires: "2024-01-16T02:30:00Z"
      }
    },
    {
      method: "GET",
      path: "/api/v1/satellite-environment",
      description: "Access satellite operational environment data",
      response: {
        date: "2024-01-15",
        protonFlux: 456,
        electronFlux: 2340,
        radiationLevel: "Moderate",
        riskLevel: 6
      }
    }
  ];

  const codeExamples = {
    curl: `curl -X GET "https://api.spaceweatherpro.com/v1/solar-flares" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    
    javascript: `const response = await fetch('https://api.spaceweatherpro.com/v1/solar-flares', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,

    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.spaceweatherpro.com/v1/solar-flares',
    headers=headers
)

data = response.json()
print(data)`,

    node: `const axios = require('axios');

const config = {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
};

axios.get('https://api.spaceweatherpro.com/v1/solar-flares', config)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`
  };

  return (
    <section id="api" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Developer-Friendly API
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            RESTful API with comprehensive documentation, real-time data, and enterprise-grade reliability
          </p>
        </div>

        {/* API Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center shadow-card">
            <Zap className="h-12 w-12 text-space-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Real-Time Data</h3>
            <p className="text-muted-foreground">Live updates from 50+ space weather monitoring stations</p>
          </Card>
          <Card className="p-6 text-center shadow-card">
            <Code className="h-12 w-12 text-space-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Easy Integration</h3>
            <p className="text-muted-foreground">Simple REST endpoints with comprehensive SDKs</p>
          </Card>
          <Card className="p-6 text-center shadow-card">
            <Book className="h-12 w-12 text-space-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Rich Documentation</h3>
            <p className="text-muted-foreground">Interactive docs with examples and testing tools</p>
          </Card>
        </div>

        {/* API Endpoints */}
        <Card className="p-6 mb-8 shadow-card">
          <h3 className="text-2xl font-bold text-foreground mb-6">API Endpoints</h3>
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-space-primary border-space-primary">
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Try It
                  </Button>
                </div>
                <p className="text-muted-foreground mb-3">{endpoint.description}</p>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-space-primary hover:text-space-primary-dark">
                    View Response Example
                  </summary>
                  <div className="mt-3 p-3 bg-muted rounded border">
                    <pre className="text-xs text-foreground overflow-x-auto">
                      {JSON.stringify(endpoint.response, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </Card>

        {/* Code Examples */}
        <Card className="p-6 shadow-card">
          <h3 className="text-2xl font-bold text-foreground mb-6">Code Examples</h3>
          <Tabs defaultValue="curl" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="node">Node.js</TabsTrigger>
            </TabsList>
            
            {Object.entries(codeExamples).map(([language, code]) => (
              <TabsContent key={language} value={language}>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 z-10"
                    onClick={() => copyToClipboard(code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
                    <code>{code}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </section>
  );
};