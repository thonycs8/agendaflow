import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { useUserRole } from "@/hooks/use-user-role";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBottomNav?: boolean;
  showFooter?: boolean;
}

export const AppLayout = ({
  children,
  title,
  showBottomNav = true,
  showFooter = true,
}: AppLayoutProps) => {
  const { isAdmin, isBusinessOwner } = useUserRole();
  const shouldShowBottomNav = showBottomNav && !isAdmin && !isBusinessOwner;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav title={title} />
      
      <main className={cn(
        "flex-1 container py-6",
        shouldShowBottomNav && "pb-20 md:pb-6"
      )}>
        {children}
      </main>

      {shouldShowBottomNav && <BottomNav />}
      {showFooter && <Footer />}
    </div>
  );
};
