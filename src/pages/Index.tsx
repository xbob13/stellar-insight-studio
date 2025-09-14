import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { ApiDocumentation } from "@/components/ApiDocumentation";
import { Documentation } from "@/components/Documentation";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

// ✅ Corrected import (matches your file name)
import DatasetsDownload from "@/components/DatasetsDownload";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Dashboard />

      {/* ✅ New: live dataset download section */}
      <DatasetsDownload />

      <ApiDocumentation />
      <Documentation />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
