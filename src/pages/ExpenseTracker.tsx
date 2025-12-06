import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import YearSelector from "@/components/expenses/YearSelector";
import YearSummary from "@/components/expenses/YearSummary";
import MonthlyOverview from "@/components/expenses/MonthlyOverview";
import AddExpenseDialog from "@/components/expenses/AddExpenseDialog";
import AddIncomeDialog from "@/components/expenses/AddIncomeDialog";
import CategoryManager from "@/components/expenses/CategoryManager";
import IncomeCategoryManager from "@/components/expenses/IncomeCategoryManager";
import SpendingChart from "@/components/expenses/SpendingChart";
import TrendChart from "@/components/expenses/TrendChart";
import MonthlyComparisonChart from "@/components/expenses/MonthlyComparisonChart";
import CarryoverDialog from "@/components/expenses/CarryoverDialog";
import { useExpenseData } from "@/hooks/useExpenseData";

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showIncomeCategoryManager, setShowIncomeCategoryManager] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { income, salaries, expenses, categories, subCategories, incomeCategories, carryovers, isLoading, refetch } = useExpenseData(selectedYear, user?.id);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalCarryover = carryovers.reduce((sum, c) => sum + Number(c.amount), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = totalIncome + totalCarryover - totalSpent;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Expense Tracker</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCategoryManager(true)}
              title="Manage Expense Categories"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowIncomeCategoryManager(true)}
              title="Manage Income Categories"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
          <div className="flex gap-2 flex-wrap">
            <AddIncomeDialog 
              userId={user.id} 
              year={selectedYear} 
              onSuccess={refetch}
              existingIncome={income}
              incomeCategories={incomeCategories}
            />
            <AddExpenseDialog
              userId={user.id}
              categories={categories}
              subCategories={subCategories}
              onSuccess={refetch}
            />
            <CarryoverDialog
              userId={user.id}
              year={selectedYear}
              onSuccess={refetch}
              existingCarryovers={carryovers}
            />
          </div>
        </div>

        <YearSummary
          totalIncome={totalIncome}
          totalSpent={totalSpent}
          remaining={remaining}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <MonthlyOverview
            year={selectedYear}
            income={income}
            expenses={expenses}
            carryovers={carryovers}
            isLoading={isLoading}
          />
          <SpendingChart
            expenses={expenses}
            categories={categories}
            subCategories={subCategories}
            year={selectedYear}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8">
          <TrendChart
            income={income}
            expenses={expenses}
            carryovers={carryovers}
            year={selectedYear}
          />
          <MonthlyComparisonChart
            income={income}
            expenses={expenses}
            year={selectedYear}
          />
        </div>

        <CategoryManager
          open={showCategoryManager}
          onOpenChange={setShowCategoryManager}
          userId={user.id}
          categories={categories}
          subCategories={subCategories}
          onSuccess={refetch}
        />

        <IncomeCategoryManager
          open={showIncomeCategoryManager}
          onOpenChange={setShowIncomeCategoryManager}
          userId={user.id}
          incomeCategories={incomeCategories}
          onSuccess={refetch}
        />
      </main>
    </div>
  );
};

export default ExpenseTracker;
