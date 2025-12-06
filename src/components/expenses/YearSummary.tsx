import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingDown, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface YearSummaryProps {
  totalIncome: number;
  totalSpent: number;
  remaining: number;
  isLoading: boolean;
}

const YearSummary = ({ totalIncome, totalSpent, remaining, isLoading }: YearSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/20">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${remaining >= 0 ? 'from-green-500/10 to-green-500/5 border-green-500/20' : 'from-destructive/10 to-destructive/5 border-destructive/20'}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${remaining >= 0 ? 'bg-green-500/20' : 'bg-destructive/20'}`}>
              <Wallet className={`h-5 w-5 ${remaining >= 0 ? 'text-green-600' : 'text-destructive'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearSummary;
