import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, TrendingUp, Clock, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const Demo = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard Demo - Barbearia Premium</h1>
          <p className="text-muted-foreground">
            Visualização completa de como seria o seu dashboard
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Agendamentos Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12%</span> vs. ontem
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Receita do Mês
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.450€</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+23%</span> vs. mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Clientes Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+45</span> este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Taxa de Ocupação
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+5%</span> vs. mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-8">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "10:00", client: "João Silva", service: "Corte + Barba", professional: "Carlos", price: "25€" },
                  { time: "11:00", client: "Pedro Santos", service: "Corte Simples", professional: "Miguel", price: "15€" },
                  { time: "11:30", client: "André Costa", service: "Barba", professional: "Carlos", price: "12€" },
                  { time: "14:00", client: "Ricardo Alves", service: "Corte Premium", professional: "Miguel", price: "30€" },
                  { time: "15:30", client: "Tiago Ferreira", service: "Corte + Barba", professional: "Carlos", price: "25€" },
                ].map((apt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold text-primary">{apt.time}</div>
                      </div>
                      <div>
                        <div className="font-medium">{apt.client}</div>
                        <div className="text-sm text-muted-foreground">{apt.service}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {apt.professional}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{apt.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance da Equipa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Carlos Mendes", appointments: 156, revenue: "3.900€", rating: 4.9, growth: "+15%" },
                  { name: "Miguel Oliveira", appointments: 142, revenue: "3.550€", rating: 4.8, growth: "+18%" },
                  { name: "André Silva", appointments: 98, revenue: "2.450€", rating: 4.7, growth: "+12%" },
                ].map((pro, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{pro.name}</div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{pro.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Agendamentos</div>
                        <div className="font-semibold">{pro.appointments}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Receita</div>
                        <div className="font-semibold">{pro.revenue}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Crescimento</div>
                        <div className="font-semibold text-green-500">{pro.growth}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2">
              {[
                { month: "Jan", value: 5200 },
                { month: "Fev", value: 6100 },
                { month: "Mar", value: 5800 },
                { month: "Abr", value: 7200 },
                { month: "Mai", value: 7800 },
                { month: "Jun", value: 8450 },
              ].map((data, idx) => {
                const maxValue = 9000;
                const height = (data.value / maxValue) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-sm font-semibold text-muted-foreground">
                      {data.value}€
                    </div>
                    <div 
                      className="w-full bg-gradient-primary rounded-t-lg transition-all duration-500 hover-scale"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-sm font-medium">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="mt-8 bg-gradient-primary text-primary-foreground">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-2">
              Gostou do que viu?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Crie sua conta grátis e comece a transformar seu negócio hoje mesmo
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 font-semibold hover:bg-background/90 transition-colors"
              >
                Começar Agora
              </a>
              <a 
                href="/contacto"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 text-primary-foreground px-8 py-3 font-semibold hover:bg-white/20 transition-colors"
              >
                Falar com Vendas
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Demo;
