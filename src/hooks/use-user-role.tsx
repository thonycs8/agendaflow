import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type UserRole = "admin" | "business_owner" | "professional" | "client";

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

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

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isBusinessOwner = hasRole("business_owner");
  const isProfessional = hasRole("professional");
  const isClient = hasRole("client");

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isBusinessOwner,
    isProfessional,
    isClient,
  };
};
