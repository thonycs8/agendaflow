import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, Euro } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  business_id: string;
  businesses?: {
    name: string;
    logo_url: string;
  };
}

const Servicos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = services.filter(
        (service) =>
          service.name.toLowerCase().includes(search.toLowerCase()) ||
          service.description?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [search, services]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*, businesses(name, logo_url)")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setServices(data || []);
      setFilteredServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Serviços Disponíveis</h1>
            <p className="text-muted-foreground">
              Escolha o serviço ideal para você
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando serviços...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {search
                  ? "Nenhum serviço encontrado com esse termo"
                  : "Nenhum serviço disponível no momento"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/agendar?service=${service.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {service.name}
                      </CardTitle>
                      {service.businesses && (
                        <Badge variant="secondary" className="mb-2">
                          {service.businesses.name}
                        </Badge>
                      )}
                    </div>
                    {service.businesses?.logo_url && (
                      <img
                        src={service.businesses.logo_url}
                        alt={service.businesses.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-xl font-bold text-primary">
                      <Euro className="h-5 w-5" />
                      <span>{service.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full">Agendar Agora</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
};

export default Servicos;
