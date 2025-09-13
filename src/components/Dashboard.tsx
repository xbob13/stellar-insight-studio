import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sun, Satellite, Radio, Download, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { spaceWeatherApi, type SolarFlareData, type GeomagneticData, type SpaceWeatherAlert } from "@/services/spaceWeatherApi";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [solarFlares, setSolarFlares] = useState<SolarFlareData[]>([]);
  const [geomagneticData, setGeomagneticData] = useState<GeomagneticData[]>([]);
  const [alerts, setAlerts] = useState<SpaceWeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [flares, geomagnetic, alertData] = await Promise.all([
        spaceWeatherApi.getSolarFlares(),
        spaceWeatherApi.getGeomagneticData(),
        spaceWeatherApi.getSpaceWeatherAlerts(),
      ]);
      
      setSolarFlares(flares);
      setGeomagneticData(geomagnetic);
      setAlerts(alertData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load space weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const exportData = (format: 'json' | 'csv') => {
    const data = {
      solarFlares,
      geomagneticData,
      alerts,
      timestamp: new Date().toISOString(),
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `space-weather-${Date.now()}.json`;
      mimeType = 'application/json';
    } else {
      // Simple CSV export for solar flares
      const csvHeader = 'Date,Time,Class,Region,Peak,Intensity\n';
      const csvRows = solarFlares.map(flare => 
        `${flare.date},${flare.time},${flare.class},${flare.region},${flare.peak},${flare.intensity}`
      ).join('\n');
      content = csvHeader + csvRows;
      filename = `solar-flares-${Date.now()}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Data exported as ${format.toUpperCase()}`,
    });
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-space-secondary/20 text-space-secondary';
      case 'MODERATE': return 'bg-space-accent/20 text-space-accent';
      case 'HIGH': return 'bg-space-warning/20 text-space-warning';
      case 'SEVERE': return 'bg-space-danger/20 text-space-danger';
      case 'EXTREME': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <section id="dashboard" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-space-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading space weather data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Real-Time Space Weather Dashboard
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Live data from NASA, NOAA, and other trusted space weather monitoring systems
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => loadData()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={() => exportData('json')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={() => exportData('csv')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Active Alerts */}
        <Card className="p-6 mb-8 shadow-card">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-space-warning mr-2" />
            <h3 className="text-lg font-semibold text-foreground">Active Space Weather Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.slice(0, 6).map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getAlertColor(alert.level)}>
                    {alert.level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{alert.type}</span>
                </div>
                <p className="text-sm text-foreground mb-2">{alert.description}</p>
                <p className="text-xs text-muted-foreground">
                  Issued: {new Date(alert.issued).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Solar Activity Chart */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center mb-4">
              <Sun className="h-5 w-5 text-space-warning mr-2" />
              <h3 className="text-lg font-semibold text-foreground">Solar Flare Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={solarFlares.slice(0, 10).reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="intensity" fill="hsl(var(--space-warning))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Geomagnetic Activity Chart */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center mb-4">
              <Radio className="h-5 w-5 text-space-primary mr-2" />
              <h3 className="text-lg font-semibold text-foreground">Geomagnetic Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={geomagneticData.reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="kIndex" 
                  stroke="hsl(var(--space-primary))" 
                  strokeWidth={2}
                  name="K-Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Solar Flares Table */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center mb-4">
            <Satellite className="h-5 w-5 text-space-secondary mr-2" />
            <h3 className="text-lg font-semibold text-foreground">Recent Solar Flares</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground">Date</th>
                  <th className="text-left p-2 text-muted-foreground">Time</th>
                  <th className="text-left p-2 text-muted-foreground">Class</th>
                  <th className="text-left p-2 text-muted-foreground">Region</th>
                  <th className="text-left p-2 text-muted-foreground">Peak</th>
                  <th className="text-left p-2 text-muted-foreground">Intensity</th>
                </tr>
              </thead>
              <tbody>
                {solarFlares.slice(0, 10).map((flare) => (
                  <tr key={flare.id} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{flare.date}</td>
                    <td className="p-2 text-foreground">{flare.time}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-space-warning border-space-warning">
                        {flare.class}
                      </Badge>
                    </td>
                    <td className="p-2 text-foreground">{flare.region}</td>
                    <td className="p-2 text-foreground">{flare.peak}</td>
                    <td className="p-2 text-foreground">{flare.intensity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
};