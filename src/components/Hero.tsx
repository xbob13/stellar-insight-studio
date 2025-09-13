import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/space-weather-hero.jpg";

export const Hero = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-cosmic relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <Badge className="mb-6 bg-space-primary/10 text-space-primary border-space-primary/20">
            Professional Space Weather Data
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Premium Space Weather
            <span className="block bg-gradient-aurora bg-clip-text text-transparent">
              Dataset API
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Access comprehensive, real-time space weather data from NASA, NOAA, and other trusted sources. 
            Clean, normalized, and ready for integration into your applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-space-primary hover:bg-space-primary-dark text-primary-foreground shadow-glow group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border hover:bg-secondary"
            >
              View Documentation
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Database className="h-5 w-5 text-space-primary" />
              <span>50+ Data Sources</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <TrendingUp className="h-5 w-5 text-space-secondary" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Shield className="h-5 w-5 text-space-accent" />
              <span>Enterprise Grade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};