import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Building, Rocket } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: <Star className="h-6 w-6" />,
      price: "$99",
      period: "/month",
      description: "Perfect for individual developers and small projects",
      features: [
        "10,000 API calls/month",
        "Basic space weather data",
        "Email support",
        "Standard documentation",
        "JSON/CSV export",
        "7-day data retention"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      icon: <Zap className="h-6 w-6" />,
      price: "$299",
      period: "/month",
      description: "Ideal for growing businesses and applications",
      features: [
        "100,000 API calls/month",
        "All space weather datasets",
        "Priority support",
        "Advanced analytics",
        "Multiple export formats",
        "30-day data retention",
        "Custom webhooks",
        "Rate limiting: 100 req/min"
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      icon: <Building className="h-6 w-6" />,
      price: "$999",
      period: "/month",
      description: "For large organizations with mission-critical needs",
      features: [
        "Unlimited API calls",
        "Premium datasets + alerts",
        "24/7 dedicated support",
        "Custom integrations",
        "All export formats",
        "Unlimited data retention",
        "Custom SLAs",
        "On-premise deployment",
        "White-label options"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const enterpriseFeatures = [
    "Custom data processing pipelines",
    "Dedicated infrastructure",
    "Advanced security compliance",
    "Priority data access",
    "Custom alerting systems",
    "Professional services"
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your space weather data needs. All plans include our core datasets and API access.
          </p>
          <Badge className="bg-space-primary/10 text-space-primary border-space-primary/20 mb-8">
            30-day money-back guarantee
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-6 shadow-card relative ${
                plan.popular ? 'ring-2 ring-space-primary shadow-glow' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-space-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-space-primary/10 rounded-lg text-space-primary">
                    {plan.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-4 w-4 text-space-secondary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-space-primary hover:bg-space-primary-dark text-primary-foreground shadow-glow' 
                    : ''
                }`}
                variant={plan.buttonVariant}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        {/* Enterprise Features */}
        <Card className="p-8 shadow-card bg-gradient-space text-primary-foreground">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Rocket className="h-8 w-8 mr-3" />
                <h3 className="text-2xl font-bold">Enterprise Solutions</h3>
              </div>
              <p className="text-primary-foreground/80 mb-6 text-lg">
                Need something more? Our enterprise solutions provide unlimited scalability, 
                custom integrations, and dedicated support for mission-critical applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-primary-foreground text-space-primary hover:bg-primary-foreground/90"
                >
                  Contact Sales
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="h-4 w-4 text-space-secondary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Trust Badges */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">Trusted by leading organizations worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-lg font-semibold text-muted-foreground">NASA</div>
            <div className="text-lg font-semibold text-muted-foreground">NOAA</div>
            <div className="text-lg font-semibold text-muted-foreground">ESA</div>
            <div className="text-lg font-semibold text-muted-foreground">SpaceX</div>
            <div className="text-lg font-semibold text-muted-foreground">Blue Origin</div>
          </div>
        </div>
      </div>
    </section>
  );
};