import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

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

interface HabitAnalyticsProps {
  year: number;
  categories: HabitCategory[];
  yearEntries: HabitEntry[];
  isLoading: boolean;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const HabitAnalytics = ({
  year,
  categories,
  yearEntries,
  isLoading,
}: HabitAnalyticsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Calculate completion rate by category
  const categoryStats = categories.map((category) => {
    const categoryEntries = yearEntries.filter(
      (e) => e.category_id === category.id
    );
    const completedEntries = categoryEntries.filter((e) => e.completed);
    const totalDays = new Date(year, 11, 31).getDate() * 12; // Approximate
    const completionRate =
      categoryEntries.length > 0
        ? (completedEntries.length / categoryEntries.length) * 100
        : 0;

    return {
      name: category.name,
      completed: completedEntries.length,
      total: categoryEntries.length,
      rate: Math.round(completionRate),
      color: category.color,
    };
  });

  // Calculate monthly trends
  const monthlyData = MONTHS.map((month, index) => {
    const monthEntries = yearEntries.filter((e) => {
      const entryMonth = new Date(e.entry_date).getMonth();
      return entryMonth === index;
    });
    const completedCount = monthEntries.filter((e) => e.completed).length;

    return {
      month,
      completed: completedCount,
      total: monthEntries.length,
      rate:
        monthEntries.length > 0
          ? Math.round((completedCount / monthEntries.length) * 100)
          : 0,
    };
  });

  // Calculate streak data for each category
  const streakData = categories.map((category) => {
    const categoryEntries = yearEntries
      .filter((e) => e.category_id === category.id && e.completed)
      .sort(
        (a, b) =>
          new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
      );

    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    categoryEntries.forEach((entry) => {
      const entryDate = new Date(entry.entry_date);
      if (lastDate) {
        const dayDiff = Math.floor(
          (entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = entryDate;
    });
    maxStreak = Math.max(maxStreak, currentStreak);

    return {
      name: category.name,
      streak: maxStreak,
      color: category.color,
    };
  });

  // Overall stats
  const totalEntries = yearEntries.length;
  const completedEntries = yearEntries.filter((e) => e.completed).length;
  const overallCompletionRate =
    totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Habits Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedEntries}</p>
            <p className="text-sm text-muted-foreground mt-1">
              out of {totalEntries} entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overallCompletionRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate by Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm">
                            Completed: {data.completed}/{data.total}
                          </p>
                          <p className="text-sm">Rate: {data.rate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{data.month}</p>
                          <p className="text-sm">
                            Completed: {data.completed}/{data.total}
                          </p>
                          <p className="text-sm">Rate: {data.rate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Streaks */}
        <Card>
          <CardHeader>
            <CardTitle>Best Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={streakData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm">
                            Best Streak: {data.streak} days
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="streak" radius={[0, 8, 8, 0]}>
                  {streakData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Habit Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Habit Completion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, rate }) => `${name}: ${rate}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="completed"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm">
                            Completed: {data.completed} times
                          </p>
                          <p className="text-sm">Rate: {data.rate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Habit</th>
                  <th className="text-right p-2">Completed</th>
                  <th className="text-right p-2">Total Entries</th>
                  <th className="text-right p-2">Completion Rate</th>
                  <th className="text-right p-2">Best Streak</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((stat, index) => {
                  const streak = streakData.find((s) => s.name === stat.name);
                  return (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stat.color }}
                          />
                          <span className="font-medium">{stat.name}</span>
                        </div>
                      </td>
                      <td className="text-right p-2">{stat.completed}</td>
                      <td className="text-right p-2">{stat.total}</td>
                      <td className="text-right p-2">
                        <span
                          className="inline-block px-2 py-1 rounded text-sm font-semibold"
                          style={{
                            backgroundColor: `${stat.color}20`,
                            color: stat.color,
                          }}
                        >
                          {stat.rate}%
                        </span>
                      </td>
                      <td className="text-right p-2">
                        {streak?.streak || 0} days
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitAnalytics;
