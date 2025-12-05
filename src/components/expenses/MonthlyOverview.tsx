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
  salaries: any[];
  expenses: any[];
  isLoading: boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthlyOverview = ({ year, salaries, expenses, isLoading }: MonthlyOverviewProps) => {
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
      const salary = salaries.find(s => s.month === monthNum)?.amount || 0;
      const monthExpenses = expenses.filter(e => {
        const expenseMonth = new Date(e.expense_date).getMonth() + 1;
        return expenseMonth === monthNum;
      });
      const spent = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const saved = Number(salary) - spent;

      return {
        month,
        salary: Number(salary),
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
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Saved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell className="font-medium">{data.month}</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.salary)}</TableCell>
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
