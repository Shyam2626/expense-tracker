import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import YearSelector from "@/components/expenses/YearSelector";
import YearSummary from "@/components/expenses/YearSummary";
import MonthlyOverview from "@/components/expenses/MonthlyOverview";
import AddExpenseDialog from "@/components/expenses/AddExpenseDialog";
import AddSalaryDialog from "@/components/expenses/AddSalaryDialog";
import CategoryManager from "@/components/expenses/CategoryManager";
import SpendingChart from "@/components/expenses/SpendingChart";
import { useExpenseData } from "@/hooks/useExpenseData";

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { salaries, expenses, categories, subCategories, isLoading, refetch } = useExpenseData(selectedYear, user?.id);

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

  const totalSalary = salaries.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = totalSalary - totalSpent;

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
            >
              <Settings className="h-4 w-4" />
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
          <div className="flex gap-2">
            <AddSalaryDialog 
              userId={user.id} 
              year={selectedYear} 
              onSuccess={refetch}
              existingSalaries={salaries}
            />
            <AddExpenseDialog
              userId={user.id}
              categories={categories}
              subCategories={subCategories}
              onSuccess={refetch}
            />
          </div>
        </div>

        <YearSummary
          totalSalary={totalSalary}
          totalSpent={totalSpent}
          remaining={remaining}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <MonthlyOverview
            year={selectedYear}
            salaries={salaries}
            expenses={expenses}
            isLoading={isLoading}
          />
          <SpendingChart
            expenses={expenses}
            categories={categories}
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
      </main>
    </div>
  );
};

export default ExpenseTracker;
