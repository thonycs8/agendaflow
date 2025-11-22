import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DashboardShowcase } from "@/components/DashboardShowcase";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <DashboardShowcase />
        <TestimonialsSection />
        <PricingSection />
        <CtaBanner />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
