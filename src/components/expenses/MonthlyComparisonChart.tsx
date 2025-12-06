import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyComparisonChartProps {
  income: any[];
  expenses: any[];
  year: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MonthlyComparisonChart = ({ income, expenses, year }: MonthlyComparisonChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChartData = () => {
    return MONTHS.map((month, index) => {
      const monthNum = index + 1;
      const monthIncome = income.filter(i => i.month === monthNum);
      const totalIncome = monthIncome.reduce((sum, i) => sum + Number(i.amount), 0);
      const monthExpenses = expenses.filter(e => {
        const expenseMonth = new Date(e.expense_date).getMonth() + 1;
        return expenseMonth === monthNum;
      });
      const spent = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        month,
        income: Number(totalIncome),
        spent,
      };
    });
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income vs Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar 
                dataKey="income" 
                fill="hsl(142, 76%, 36%)" 
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="spent" 
                fill="hsl(0, 84%, 60%)" 
                name="Spent"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyComparisonChart;

