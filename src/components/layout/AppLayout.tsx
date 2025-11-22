import { ReactNode } from "react";
import { GlobalNavbar } from "./GlobalNavbar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalNavbar />
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
