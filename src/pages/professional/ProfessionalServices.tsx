import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BusinessServices from "@/components/business/BusinessServices";

const ProfessionalServices = () => {
  const { user } = useAuth();
  const { isProfessional, loading } = useUserRole();
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isProfessional) {
      navigate("/dashboard");
    }
  }, [isProfessional, loading, navigate]);

  useEffect(() => {
    const fetchProfessionalBusiness = async () => {
      if (!user) return;

      const { data: professional } = await supabase
        .from("professionals")
        .select("business_id")
        .eq("user_id", user.id)
        .single();

      if (professional) {
        setBusinessId(professional.business_id);
      }
    };

    if (isProfessional) {
      fetchProfessionalBusiness();
    }
  }, [user, isProfessional]);

  if (loading || !businessId) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gestão de Serviços</h2>
        <p className="text-muted-foreground">
          Gerir os serviços que você oferece no estabelecimento
        </p>
      </div>
      
      <BusinessServices businessId={businessId} />
    </div>
  );
};

export default ProfessionalServices;
