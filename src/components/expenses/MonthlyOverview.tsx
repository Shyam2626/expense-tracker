import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyOverviewProps {
  year: number;
  income: any[];
  expenses: any[];
  carryovers: any[];
  isLoading: boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthlyOverview = ({ year, income, expenses, carryovers, isLoading }: MonthlyOverviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthlyData = () => {
    return MONTHS.map((month, index) => {
      const monthNum = index + 1;
      const monthIncome = income.filter(i => i.month === monthNum);
      const totalIncome = monthIncome.reduce((sum, i) => sum + Number(i.amount), 0);
      const carryover = carryovers.find(c => c.month === monthNum)?.amount || 0;
      const monthExpenses = expenses.filter(e => {
        const expenseMonth = new Date(e.expense_date).getMonth() + 1;
        return expenseMonth === monthNum;
      });
      const spent = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const saved = Number(totalIncome) + Number(carryover) - spent;

      return {
        month,
        income: Number(totalIncome),
        carryover: Number(carryover),
        spent,
        saved,
      };
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const monthlyData = getMonthlyData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview - {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Carryover</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Saved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell className="font-medium">{data.month}</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.income)}</TableCell>
                  <TableCell className={`text-right ${data.carryover >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {data.carryover !== 0 ? formatCurrency(data.carryover) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    {formatCurrency(data.spent)}
                  </TableCell>
                  <TableCell className={`text-right ${data.saved >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {formatCurrency(data.saved)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
