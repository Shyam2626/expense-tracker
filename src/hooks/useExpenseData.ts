import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useExpenseData = (year: number, userId: string | undefined) => {
  const { data: salaries = [], refetch: refetchSalaries } = useQuery({
    queryKey: ["salaries", year, userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("monthly_salaries")
        .select("*")
        .eq("user_id", userId)
        .eq("year", year)
        .order("month", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: expenses = [], refetch: refetchExpenses } = useQuery({
    queryKey: ["expenses", year, userId],
    queryFn: async () => {
      if (!userId) return [];
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .gte("expense_date", startDate)
        .lte("expense_date", endDate)
        .order("expense_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ["categories", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: subCategories = [], refetch: refetchSubCategories } = useQuery({
    queryKey: ["sub_categories", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("sub_categories")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const refetch = () => {
    refetchSalaries();
    refetchExpenses();
    refetchCategories();
    refetchSubCategories();
  };

  const isLoading = !userId;

  return {
    salaries,
    expenses,
    categories,
    subCategories,
    isLoading,
    refetch,
  };
};
