import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CHART_COLORS = [
  "hsl(0, 84%, 60%)",
  "hsl(25, 95%, 53%)",
  "hsl(48, 96%, 53%)",
  "hsl(38, 92%, 50%)",
  "hsl(173, 58%, 39%)",
  "hsl(199, 89%, 48%)",
  "hsl(231, 48%, 48%)",
  "hsl(291, 47%, 51%)",
  "hsl(340, 82%, 52%)",
  "hsl(350, 80%, 50%)",
];

interface Top10ExpensesChartProps {
  expenses: any[];
  categories: any[];
  subCategories: any[];
}

const Top10ExpensesChart = ({
  expenses,
  categories,
  subCategories,
}: Top10ExpensesChartProps) => {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter expenses by month
  const filteredExpenses =
    selectedMonth === "all"
      ? expenses
      : expenses.filter((e) => {
          const expenseMonth = new Date(e.expense_date).getMonth() + 1;
          return expenseMonth === parseInt(selectedMonth);
        });

  // Sort by date descending
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) =>
      new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime()
  );

  // Group expenses by category
  const categoryTotals: { [key: string]: number } = {};
  filteredExpenses.forEach((expense) => {
    const cat = categories.find((c) => c.id === expense.category_id);
    const catName = cat?.name || "Unknown";
    categoryTotals[catName] = (categoryTotals[catName] || 0) + Number(expense.amount);
  });

  // Convert to array and sort by amount
  const categoryExpenses = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (categoryExpenses.length === 0) {
    return null;
  }

  // Calculate dynamic height based on number of categories (minimum 320px, max 600px)
  const chartHeight = Math.min(Math.max(categoryExpenses.length * 45, 320), 600);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Top Expenses
          </CardTitle>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {MONTHS.map((month, idx) => (
                <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryExpenses}
              layout="vertical"
              barCategoryGap="15%"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                width={120}
                fontSize={11}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Total"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={30}>
                {categoryExpenses.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Top10ExpensesChart;

