import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { ApiDocumentation } from "@/components/ApiDocumentation";
import { Documentation } from "@/components/Documentation";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

// ✅ Import dataset download component
import DatasetDownloads from "@/components/DatasetDownloads";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Dashboard />

      {/* Our dataset downloads section */}
      <DatasetDownloads />

      <ApiDocumentation />
      <Documentation />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
