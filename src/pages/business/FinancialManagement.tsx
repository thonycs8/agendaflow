import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Plus, Euro, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  transaction_date: string;
}

export default function FinancialManagement() {
  const { user } = useAuth();
  const { isBusinessOwner, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    category: "",
    amount: "",
    description: "",
  });

  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  useEffect(() => {
    if (!roleLoading && !isBusinessOwner) {
      navigate("/login");
    }
  }, [isBusinessOwner, roleLoading, navigate]);

  const generatePDFReport = async (period: "month" | "year") => {
    if (!user) return;

    const { data: business } = await supabase
      .from("businesses")
      .select("name")
      .eq("owner_id", user.id)
      .single();

    if (!business) return;

    const now = new Date();
    const startDate = period === "month" ? startOfMonth(now) : startOfYear(now);
    const endDate = period === "month" ? endOfMonth(now) : endOfYear(now);

    const { data: reportTransactions } = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("business_id", businessId)
      .gte("transaction_date", startDate.toISOString())
      .lte("transaction_date", endDate.toISOString())
      .order("transaction_date", { ascending: false });

    if (!reportTransactions || reportTransactions.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há transações para este período",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text(`Relatório Financeiro - ${business.name}`, 14, 20);
    
    doc.setFontSize(12);
    doc.text(
      `Período: ${format(startDate, "dd/MM/yyyy", { locale: pt })} - ${format(
        endDate,
        "dd/MM/yyyy",
        { locale: pt }
      )}`,
      14,
      30
    );

    // Summary
    const totalIncome = reportTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = reportTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    doc.setFontSize(14);
    doc.text("Resumo", 14, 40);
    doc.setFontSize(10);
    doc.text(`Total Entradas: €${totalIncome.toFixed(2)}`, 14, 48);
    doc.text(`Total Saídas: €${totalExpense.toFixed(2)}`, 14, 54);
    doc.text(`Saldo: €${balance.toFixed(2)}`, 14, 60);

    // Transactions table
    const tableData = reportTransactions.map((tx) => [
      format(new Date(tx.transaction_date), "dd/MM/yyyy", { locale: pt }),
      tx.type === "income" ? "Entrada" : "Saída",
      tx.category,
      tx.description || "—",
      `€${Number(tx.amount).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 70,
      head: [["Data", "Tipo", "Categoria", "Descrição", "Valor"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 },
    });

    // Save PDF
    const fileName = `relatorio-financeiro-${period === "month" ? "mensal" : "anual"}-${format(
      now,
      "yyyy-MM"
    )}.pdf`;
    doc.save(fileName);

    toast({
      title: "Relatório gerado",
      description: `PDF exportado: ${fileName}`,
    });
  };

  const fetchTransactions = async () => {
    if (!user) return;

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!business) {
      setLoading(false);
      return;
    }

    setBusinessId(business.id);

    const { data } = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("business_id", business.id)
      .order("transaction_date", { ascending: false });

    const txs = (data || []).map(tx => ({
      ...tx,
      type: tx.type as "income" | "expense"
    }));
    setTransactions(txs);

    const income = txs
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = txs
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setTotals({
      income,
      expense,
      balance: income - expense,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("financial_transactions").insert({
      business_id: businessId,
      type: formData.type,
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description,
      transaction_date: new Date().toISOString(),
    });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a transação",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Transação criada com sucesso",
    });

    setDialogOpen(false);
    setFormData({
      type: "income",
      category: "",
      amount: "",
      description: "",
    });
    fetchTransactions();
  };

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar finanças...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <p className="text-muted-foreground">
            Controlo de entradas, saídas e fluxo de caixa
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generatePDFReport("month")}>
            <FileDown className="mr-2 h-4 w-4" />
            Relatório Mensal (PDF)
          </Button>
          <Button variant="outline" onClick={() => generatePDFReport("year")}>
            <FileDown className="mr-2 h-4 w-4" />
            Relatório Anual (PDF)
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registar Transação</DialogTitle>
              <DialogDescription>
                Adicione uma entrada ou saída financeira
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "income" | "expense") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Ex: Serviço, Produto, Salário"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Valor (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detalhes da transação..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Registar Transação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{totals.income.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              €{totals.expense.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Euro className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totals.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              €{totals.balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="income">Entradas</TabsTrigger>
              <TabsTrigger value="expense">Saídas</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {new Date(tx.transaction_date).toLocaleDateString("pt-PT")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={tx.type === "income" ? "default" : "destructive"}
                        >
                          {tx.type === "income" ? (
                            <ArrowUpCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDownCircle className="mr-1 h-3 w-3" />
                          )}
                          {tx.type === "income" ? "Entrada" : "Saída"}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {tx.description || "—"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          tx.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}€{tx.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="income">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter((tx) => tx.type === "income")
                    .map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          {new Date(tx.transaction_date).toLocaleDateString("pt-PT")}
                        </TableCell>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {tx.description || "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          +€{tx.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="expense">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter((tx) => tx.type === "expense")
                    .map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          {new Date(tx.transaction_date).toLocaleDateString("pt-PT")}
                        </TableCell>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {tx.description || "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          -€{tx.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
