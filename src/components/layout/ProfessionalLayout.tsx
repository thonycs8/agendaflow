import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { ProfessionalSidebar } from "./ProfessionalSidebar";
import { Footer } from "./Footer";

interface ProfessionalLayoutProps {
  children: ReactNode;
  title?: string;
}

export const ProfessionalLayout = ({ children, title }: ProfessionalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav title={title} showMenuButton={false} />
      
      <div className="flex flex-1">
        <ProfessionalSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
