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
  const { hasRole, loading: roleLoading, roles, actualRoles, actualIsAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute check:', { 
      authLoading, 
      roleLoading, 
      user: !!user, 
      requiredRole, 
      hasRole: requiredRole ? hasRole(requiredRole) : 'N/A',
      allRoles: roles,
      actualRoles
    });

    if (!authLoading && !roleLoading) {
      if (requireAuth && !user) {
        console.log('Redirecting to login - no user');
        navigate("/login");
        return;
      }

      // If user is admin, allow access to everything
      if (actualIsAdmin) {
        return;
      }

      // Otherwise check actual roles (not override)
      if (requiredRole && !actualRoles.includes(requiredRole)) {
        console.log('Redirecting to profile - missing role:', requiredRole);
        navigate("/profile");
      }
    }
  }, [user, requiredRole, hasRole, authLoading, roleLoading, navigate, requireAuth, roles, actualRoles, actualIsAdmin]);

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

  // Admin can access everything
  if (actualIsAdmin) {
    return <>{children}</>;
  }

  // Otherwise check actual roles
  if (requiredRole && !actualRoles.includes(requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
