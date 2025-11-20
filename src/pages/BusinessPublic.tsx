import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Phone, Mail, Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingFlow } from "@/components/business/BookingFlow";

interface Business {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  cover_image_url: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  total_reviews: number;
}

interface Professional {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  rating: number;
  total_reviews: number;
  specialties: string[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
}

const BusinessPublic = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      // For now, fetch first business - later implement slug-based lookup
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("is_active", true)
        .single();

      if (businessData) {
        setBusiness(businessData);

        // Fetch professionals
        const { data: profsData } = await supabase
          .from("professionals")
          .select("*")
          .eq("business_id", businessData.id)
          .eq("is_active", true);

        setProfessionals(profsData || []);

        // Fetch services
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("business_id", businessData.id)
          .eq("is_active", true);

        setServices(servicesData || []);

        // Fetch membership plans
        const { data: plansData } = await supabase
          .from("membership_plans")
          .select("*")
          .eq("business_id", businessData.id)
          .eq("is_active", true);

        setPlans(plansData || []);
      }

      setLoading(false);
    };

    fetchBusinessData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Negócio não encontrado</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: business.cover_image_url
            ? `url(${business.cover_image_url})`
            : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container h-full flex flex-col justify-center items-center text-center text-white">
          {business.logo_url && (
            <img
              src={business.logo_url}
              alt={business.name}
              className="h-24 w-24 rounded-full mb-4 border-4 border-white shadow-lg"
            />
          )}
          <h1 className="text-5xl font-bold mb-4">{business.name}</h1>
          <p className="text-xl max-w-2xl mb-6">{business.description}</p>
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {business.rating?.toFixed(1) || "5.0"}
            </span>
            <span className="text-sm">
              ({business.total_reviews || 0} avaliações)
            </span>
          </div>
          <Button size="lg" className="text-lg px-8">
            Agendar Agora
          </Button>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-6 border-b bg-muted/30">
        <div className="container flex flex-wrap gap-6 justify-center">
          {business.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{business.address}</span>
            </div>
          )}
          {business.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{business.phone}</span>
            </div>
          )}
          {business.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{business.email}</span>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 Promoção Especial!</h2>
          <p className="text-xl mb-6">
            Ganhe 20% de desconto no seu primeiro agendamento
          </p>
          <Button size="lg" variant="secondary">
            Aproveitar Oferta
          </Button>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-16 container">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossos Profissionais
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {professionals.map((prof) => (
            <Card key={prof.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={prof.avatar_url} />
                    <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-2">{prof.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{prof.bio}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {prof.rating?.toFixed(1) || "5.0"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({prof.total_reviews || 0})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {prof.specialties?.map((spec, idx) => (
                      <Badge key={idx} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Nossos Serviços</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      €{service.price.toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full">Agendar</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Banner */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">💎 Torne-se Premium</h2>
          <p className="text-xl mb-6">
            Economize com planos de assinatura mensais e garanta seus horários favoritos
          </p>
          <Button size="lg" variant="secondary">
            Ver Planos Premium
          </Button>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-16 container">
        <h2 className="text-3xl font-bold mb-8 text-center">Seja Premium</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="relative overflow-hidden hover:shadow-xl transition-all hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Assinar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            O que nossos clientes dizem
          </h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Cliente {i}</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Excelente serviço! Profissionais muito atenciosos e o ambiente
                        é incrível. Recomendo muito!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessPublic;
