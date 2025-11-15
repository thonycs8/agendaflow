import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole, UserRole } from "@/hooks/use-user-role";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: roleLoading, roles } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute check:', { 
      authLoading, 
      roleLoading, 
      user: !!user, 
      requiredRole, 
      hasRole: requiredRole ? hasRole(requiredRole) : 'N/A',
      allRoles: roles
    });

    if (!authLoading && !roleLoading) {
      if (requireAuth && !user) {
        console.log('Redirecting to login - no user');
        navigate("/login");
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        console.log('Redirecting to profile - missing role:', requiredRole);
        navigate("/profile");
      }
    }
  }, [user, requiredRole, hasRole, authLoading, roleLoading, navigate, requireAuth, roles]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
