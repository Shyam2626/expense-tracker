import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface HabitCategory {
  id: string;
  name: string;
  color: string;
}

interface HabitEntry {
  id: string;
  category_id: string;
  entry_date: string;
  completed: boolean;
}

interface MonthlyHabitGridProps {
  year: number;
  month: number;
  categories: HabitCategory[];
  entries: HabitEntry[];
  userId: string;
  onSuccess: () => void;
  isLoading: boolean;
}

const MonthlyHabitGrid = ({
  year,
  month,
  categories,
  entries,
  userId,
  onSuccess,
  isLoading,
}: MonthlyHabitGridProps) => {
  const [updating, setUpdating] = useState<string | null>(null);

  // Get days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get entry for a specific category and day
  const getEntry = (categoryId: string, day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return entries.find(
      (e) => e.category_id === categoryId && e.entry_date === dateStr
    );
  };

  // Cycle through habit states: Empty → Completed (✓) → Not Done (✗) → Empty
  const cycleHabitState = async (categoryId: string, day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const key = `${categoryId}-${day}`;
    setUpdating(key);

    try {
      const existingEntry = getEntry(categoryId, day);

      if (!existingEntry) {
        // State: Empty → Create as Completed (✓)
        const { error } = await supabase.from("habit_entries").insert({
          user_id: userId,
          category_id: categoryId,
          entry_date: dateStr,
          completed: true,
        });

        if (error) throw error;
      } else if (existingEntry.completed === true) {
        // State: Completed (✓) → Change to Not Done (✗)
        const { error } = await supabase
          .from("habit_entries")
          .update({ completed: false })
          .eq("id", existingEntry.id);

        if (error) throw error;
      } else {
        // State: Not Done (✗) → Delete entry (back to Empty)
        const { error } = await supabase
          .from("habit_entries")
          .delete()
          .eq("id", existingEntry.id);

        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to update habit");
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            No habit categories yet. Add some categories to start tracking!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Habit Tracker -{" "}
          {new Date(year, month - 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b font-semibold sticky left-0 bg-card z-10 min-w-[150px]">
                  Habit
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="text-center p-2 border-b text-sm font-medium min-w-[40px]"
                  >
                    {day}
                  </th>
                ))}
                <th className="text-center p-2 border-b font-semibold min-w-[80px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const completedDays = days.filter((day) => {
                  const entry = getEntry(category.id, day);
                  return entry?.completed === true; // Only count explicitly completed
                }).length;

                const notDoneDays = days.filter((day) => {
                  const entry = getEntry(category.id, day);
                  return entry?.completed === false; // Count explicitly marked as not done
                }).length;

                return (
                  <tr key={category.id} className="border-b last:border-b-0">
                    <td className="p-2 sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    {days.map((day) => {
                      const entry = getEntry(category.id, day);
                      const key = `${category.id}-${day}`;
                      const isUpdating = updating === key;
                      const isCompleted = entry?.completed === true;
                      const isNotDone = entry?.completed === false;

                      return (
                        <td key={day} className="text-center p-2">
                          <div className="flex items-center justify-center">
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <button
                                onClick={() =>
                                  cycleHabitState(category.id, day)
                                }
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                                title={
                                  !entry
                                    ? "Click to mark as done"
                                    : isCompleted
                                    ? "Click to mark as not done"
                                    : "Click to clear"
                                }
                              >
                                {!entry ? (
                                  <div className="w-4 h-4 border-2 border-muted-foreground rounded" />
                                ) : isCompleted ? (
                                  <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                    ✓
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                    ✗
                                  </div>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-center p-2 font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className="inline-block px-2 py-1 rounded text-sm"
                          style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          ✓ {completedDays}
                        </span>
                        {notDoneDays > 0 && (
                          <span className="inline-block px-2 py-1 rounded text-sm bg-red-100 text-red-600">
                            ✗ {notDoneDays}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyHabitGrid;
