import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { AppSidebar } from "./AppSidebar";
import { AppFooter } from "./AppFooter";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopNav />
        
        <div className="flex flex-1 w-full">
          <AppSidebar />
          
          <main className="flex-1 overflow-y-auto">
            <div className="container py-6">
              {children}
            </div>
          </main>
        </div>
        
        <AppFooter />
      </div>
    </SidebarProvider>
  );
};
