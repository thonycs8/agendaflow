import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { OwnerSidebar } from "./OwnerSidebar";
import { Footer } from "./Footer";

interface OwnerLayoutProps {
  children: ReactNode;
  title?: string;
}

export const OwnerLayout = ({ children, title }: OwnerLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav title={title} showMenuButton={false} />
      
      <div className="flex flex-1">
        <OwnerSidebar />
        
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
