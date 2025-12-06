import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TrendChartProps {
  income: any[];
  expenses: any[];
  carryovers: any[];
  year: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const TrendChart = ({ income, expenses, carryovers, year }: TrendChartProps) => {
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
        spent,
        saved,
      };
    });
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={2}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="spent" 
                stroke="hsl(0, 84%, 60%)" 
                strokeWidth={2}
                name="Spent"
              />
              <Line 
                type="monotone" 
                dataKey="saved" 
                stroke="hsl(199, 89%, 48%)" 
                strokeWidth={2}
                name="Saved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;

