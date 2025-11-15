import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type UserRole = "admin" | "business_owner" | "professional" | "client";

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleOverride, setRoleOverride] = useState<UserRole | null>(() => {
    const stored = localStorage.getItem('admin_role_override');
    return stored ? (stored as UserRole) : null;
  });

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        setRoles([]);
      } else {
        setRoles(data?.map((r) => r.role as UserRole) || []);
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  const actualIsAdmin = roles.includes("admin");
  
  // If admin has role override active, use that instead
  const effectiveRoles = actualIsAdmin && roleOverride ? [roleOverride] : roles;
  
  const hasRole = (role: UserRole) => effectiveRoles.includes(role);
  const isAdmin = effectiveRoles.includes("admin");
  const isBusinessOwner = effectiveRoles.includes("business_owner");
  const isProfessional = effectiveRoles.includes("professional");
  const isClient = effectiveRoles.includes("client");

  const setAdminRoleOverride = (role: UserRole | null) => {
    if (!actualIsAdmin) return; // Only admins can override
    
    if (role) {
      localStorage.setItem('admin_role_override', role);
    } else {
      localStorage.removeItem('admin_role_override');
    }
    setRoleOverride(role);
  };

  return {
    roles: effectiveRoles,
    actualRoles: roles,
    loading,
    hasRole,
    isAdmin,
    isBusinessOwner,
    isProfessional,
    isClient,
    actualIsAdmin,
    roleOverride,
    setAdminRoleOverride,
  };
};
