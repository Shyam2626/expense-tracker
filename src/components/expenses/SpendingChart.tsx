import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SpendingChartProps {
  expenses: any[];
  categories: any[];
  subCategories: any[];
  year: number;
}

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(188, 94%, 45%)",
  "hsl(201, 96%, 32%)",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(280, 80%, 50%)",
  "hsl(320, 70%, 50%)",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SpendingChart = ({ expenses, categories, subCategories, year }: SpendingChartProps) => {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getChartData = () => {
    let filteredExpenses = expenses;

    // Filter by month
    if (selectedMonth !== "all") {
      const monthNum = parseInt(selectedMonth);
      filteredExpenses = filteredExpenses.filter(e => {
        const expenseMonth = new Date(e.expense_date).getMonth() + 1;
        return expenseMonth === monthNum;
      });
    }

    // If category is selected, show subcategories breakdown
    if (selectedCategory !== "all") {
      filteredExpenses = filteredExpenses.filter(e => e.category_id === selectedCategory);
      
      const subCategoryTotals: { [key: string]: number } = {};
      filteredExpenses.forEach(expense => {
        const subCat = subCategories.find(sc => sc.id === expense.sub_category_id);
        const subCatName = subCat?.name || "No Subcategory";
        subCategoryTotals[subCatName] = (subCategoryTotals[subCatName] || 0) + Number(expense.amount);
      });

      return Object.entries(subCategoryTotals).map(([name, value]) => ({
        name,
        value,
      }));
    }

    // Otherwise show categories
    const categoryTotals: { [key: string]: number } = {};
    filteredExpenses.forEach(expense => {
      const cat = categories.find(c => c.id === expense.category_id);
      const catName = cat?.name || "Unknown";
      categoryTotals[catName] = (categoryTotals[catName] || 0) + Number(expense.amount);
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getCategoryDetails = (categoryName: string) => {
    let filteredExpenses = expenses;

    // Filter by month
    if (selectedMonth !== "all") {
      const monthNum = parseInt(selectedMonth);
      filteredExpenses = filteredExpenses.filter(e => {
        const expenseMonth = new Date(e.expense_date).getMonth() + 1;
        return expenseMonth === monthNum;
      });
    }

    // If a specific category is selected, show its expenses
    if (selectedCategory !== "all") {
      filteredExpenses = filteredExpenses.filter(e => e.category_id === selectedCategory);
      
      // Group by subcategory name for display
      const subCat = subCategories.find(sc => sc.name === categoryName);
      if (subCat) {
        return filteredExpenses
          .filter(e => e.sub_category_id === subCat.id)
          .map(e => ({
            ...e,
            subCategoryName: categoryName,
          }));
      }
      
      // Or show expenses without subcategory if categoryName is "No Subcategory"
      if (categoryName === "No Subcategory") {
        return filteredExpenses
          .filter(e => !e.sub_category_id)
          .map(e => ({
            ...e,
            subCategoryName: null,
          }));
      }
      
      return filteredExpenses.map(e => {
        const subCat = subCategories.find(sc => sc.id === e.sub_category_id);
        return {
          ...e,
          subCategoryName: subCat?.name || null,
        };
      });
    }

    // Otherwise, show expenses for the main category
    const cat = categories.find(c => c.name === categoryName);
    if (!cat) return [];

    return filteredExpenses
      .filter(e => e.category_id === cat.id)
      .map(e => {
        const subCat = subCategories.find(sc => sc.id === e.sub_category_id);
        return {
          ...e,
          subCategoryName: subCat?.name || null,
        };
      });
  };

  const chartData = getChartData();
  const totalSpent = chartData.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="space-y-2 pb-2">
        <CardTitle>Spending by Category</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Month" />
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      percent > 0.08 ? `${(percent * 100).toFixed(0)}%` : ''
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {chartData.map((item, index) => {
                  const details = getCategoryDetails(item.name);
                  return (
                    <AccordionItem key={item.name} value={item.name}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="font-medium text-sm">{formatCurrency(item.value)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-5 space-y-2 pt-2">
                          {details.map((expense) => (
                            <div key={expense.id} className="text-xs space-y-1 pb-2 border-b last:border-0">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  {expense.subCategoryName && (
                                    <div className="font-medium text-muted-foreground">
                                      {expense.subCategoryName}
                                    </div>
                                  )}
                                  {expense.description && (
                                    <div className="text-muted-foreground mt-1">
                                      {expense.description}
                                    </div>
                                  )}
                                  <div className="text-muted-foreground mt-1">
                                    {new Date(expense.expense_date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="font-medium ml-2">
                                  {formatCurrency(Number(expense.amount))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
              <div className="pt-4 border-t border-border flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No expenses recorded {selectedMonth !== "all" ? `for ${MONTHS[parseInt(selectedMonth) - 1]}` : ""}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
