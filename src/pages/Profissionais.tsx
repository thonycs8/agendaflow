import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Professional {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  rating: number;
  total_reviews: number;
  specialties: string[];
  business_id: string;
  businesses?: {
    name: string;
  };
}

const Profissionais = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = professionals.filter(
        (prof) =>
          prof.name.toLowerCase().includes(search.toLowerCase()) ||
          prof.bio?.toLowerCase().includes(search.toLowerCase()) ||
          prof.specialties?.some((s) =>
            s.toLowerCase().includes(search.toLowerCase())
          )
      );
      setFilteredProfessionals(filtered);
    } else {
      setFilteredProfessionals(professionals);
    }
  }, [search, professionals]);

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select("*, businesses(name)")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
      setFilteredProfessionals(data || []);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Nossos Profissionais</h1>
            <p className="text-muted-foreground">
              Conheça nossa equipe de especialistas
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar profissionais..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando profissionais...</p>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {search
                  ? "Nenhum profissional encontrado com esse termo"
                  : "Nenhum profissional disponível no momento"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map((prof) => (
              <Card
                key={prof.id}
                className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/agendar?professional=${prof.id}`)}
              >
                <CardHeader>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={prof.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {prof.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{prof.name}</h3>
                      
                      {prof.businesses && (
                        <Badge variant="outline">{prof.businesses.name}</Badge>
                      )}

                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {prof.rating?.toFixed(1) || "5.0"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({prof.total_reviews || 0} avaliações)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {prof.bio && (
                    <p className="text-sm text-muted-foreground text-center line-clamp-3">
                      {prof.bio}
                    </p>
                  )}

                  {prof.specialties && prof.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {prof.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button className="w-full">Agendar com {prof.name.split(' ')[0]}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profissionais;
