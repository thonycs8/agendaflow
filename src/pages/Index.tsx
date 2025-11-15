import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { GlobalFooter } from "@/components/layout/GlobalFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <Footer />
      </div>
      <GlobalFooter />
    </div>
  );
};

export default Index;
