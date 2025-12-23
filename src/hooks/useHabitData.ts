import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHabitData = (
  year: number,
  month: number,
  userId: string | undefined
) => {
  return useQuery({
    queryKey: ["habits", year, month, userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");

      // Fetch habit categories
      const { data: categories, error: categoriesError } = await supabase
        .from("habit_categories")
        .select("*")
        .eq("user_id", userId)
        .order("name");

      if (categoriesError) throw categoriesError;

      // Calculate date range for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Fetch habit entries for the month
      const { data: entries, error: entriesError } = await supabase
        .from("habit_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("entry_date", startDate.toISOString().split("T")[0])
        .lte("entry_date", endDate.toISOString().split("T")[0]);

      if (entriesError) throw entriesError;

      // Fetch all entries for the year (for analytics)
      const yearStartDate = new Date(year, 0, 1);
      const yearEndDate = new Date(year, 11, 31);

      const { data: yearEntries, error: yearEntriesError } = await supabase
        .from("habit_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("entry_date", yearStartDate.toISOString().split("T")[0])
        .lte("entry_date", yearEndDate.toISOString().split("T")[0]);

      if (yearEntriesError) throw yearEntriesError;

      return {
        categories: categories || [],
        entries: entries || [],
        yearEntries: yearEntries || [],
      };
    },
    enabled: !!userId,
  });
};
