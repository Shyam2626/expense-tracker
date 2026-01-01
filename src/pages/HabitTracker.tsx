import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, DollarSign } from "lucide-react";
import { useHabitData } from "@/hooks/useHabitData";
import HabitCategoryManager from "@/components/habits/HabitCategoryManager";
import MonthlyHabitGrid from "@/components/habits/MonthlyHabitGrid";
import HabitAnalytics from "@/components/habits/HabitAnalytics";
import DailyNotes from "@/components/habits/DailyNotes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const HabitTracker = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [user, setUser] = useState<any>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const { data, isLoading, refetch } = useHabitData(
    selectedYear,
    selectedMonth,
    user?.id
  );

  const categories = data?.categories || [];
  const entries = data?.entries || [];
  const yearEntries = data?.yearEntries || [];

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) return null;

  // Generate years from 2025 to current year + 1
  const startYear = 2025;
  const endYear = currentDate.getFullYear() + 1;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Habit Tracker</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/expenses")}>
              <DollarSign className="h-4 w-4 mr-2" />
              Expenses
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCategoryManager(!showCategoryManager)}
            >
              Manage Categories
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Year and Month Selector */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Year:</label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Month:</label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Manager */}
        {showCategoryManager && (
          <div className="mb-6">
            <HabitCategoryManager
              userId={user.id}
              categories={categories}
              onSuccess={refetch}
            />
          </div>
        )}

        {/* Tabs for Monthly View, Daily Notes, and Analytics */}
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            <TabsTrigger value="notes">Daily Notes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="mt-6">
            <MonthlyHabitGrid
              year={selectedYear}
              month={selectedMonth}
              categories={categories}
              entries={entries}
              userId={user.id}
              onSuccess={refetch}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <DailyNotes
              userId={user.id}
              year={selectedYear}
              month={selectedMonth}
              onSuccess={refetch}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <HabitAnalytics
              year={selectedYear}
              categories={categories}
              yearEntries={yearEntries}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HabitTracker;
