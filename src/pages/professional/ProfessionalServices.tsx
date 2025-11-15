import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfessionalLayout } from "@/components/layout/ProfessionalLayout";
import BusinessServices from "@/components/business/BusinessServices";

const ProfessionalServices = () => {
  const { user } = useAuth();
  const { isProfessional, loading } = useUserRole();
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isProfessional) {
      navigate("/login");
    }
  }, [isProfessional, loading, navigate]);

  useEffect(() => {
    const fetchProfessionalBusiness = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("professionals")
        .select("business_id")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setBusinessId(data.business_id);
      }
    };

    if (isProfessional) {
      fetchProfessionalBusiness();
    }
  }, [user, isProfessional]);

  if (loading || !businessId) return null;

  return (
    <ProfessionalLayout title="Meus Serviços">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gestão de Serviços</h2>
          <p className="text-muted-foreground">
            Gerir os serviços que você oferece no estabelecimento
          </p>
        </div>
        
        <BusinessServices businessId={businessId} />
      </div>
    </ProfessionalLayout>
  );
};

export default ProfessionalServices;
