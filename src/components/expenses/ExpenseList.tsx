import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ExpenseListProps {
  expenses: any[];
  categories: any[];
  subCategories: any[];
  income: any[];
  year: number;
  onSuccess: () => void;
}

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

const ExpenseList = ({
  expenses,
  categories,
  subCategories,
  income,
  year,
  onSuccess,
}: ExpenseListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editExpense, setEditExpense] = useState<any>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSubCategoryId, setEditSubCategoryId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    year === currentYear ? currentMonth.toString() : "all"
  );

  // Reset month filter when year changes
  useEffect(() => {
    if (year === currentYear) {
      setSelectedMonth(currentMonth.toString());
    } else {
      setSelectedMonth("all");
    }
  }, [year, currentYear, currentMonth]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({
        title: "Error deleting expense",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Expense deleted successfully" });
      onSuccess();
    }
    setDeleteId(null);
  };

  const handleEdit = (expense: any) => {
    setEditExpense(expense);
    setEditAmount(expense.amount.toString());
    setEditCategoryId(expense.category_id);
    setEditSubCategoryId(expense.sub_category_id || "");
    setEditDescription(expense.description || "");
    setEditDate(expense.expense_date);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExpense || !editAmount || !editCategoryId) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("expenses")
      .update({
        amount: parseFloat(editAmount),
        category_id: editCategoryId,
        sub_category_id: editSubCategoryId || null,
        description: editDescription || null,
        expense_date: editDate,
      })
      .eq("id", editExpense.id);

    setIsSubmitting(false);
    if (error) {
      toast({
        title: "Error updating expense",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Expense updated successfully" });
      setEditExpense(null);
      onSuccess();
    }
  };

  const filteredSubCategories = subCategories.filter(
    (sc) => sc.category_id === editCategoryId
  );

  const filteredExpenses =
    selectedMonth === "all"
      ? expenses
      : expenses.filter((e) => {
          const expenseMonth = new Date(e.expense_date).getMonth() + 1;
          return expenseMonth === parseInt(selectedMonth);
        });

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) =>
      new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime()
  );

  // Calculate totals for selected month
  const monthExpenses = expenses.filter((e) => {
    if (selectedMonth === "all") return true;
    const expenseMonth = new Date(e.expense_date).getMonth() + 1;
    return expenseMonth === parseInt(selectedMonth);
  });

  const totalSpent = monthExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // Calculate total income for selected month
  const monthIncome = income.filter((i) => {
    if (selectedMonth === "all") return true;
    return i.month === parseInt(selectedMonth);
  });

  const totalIncome = monthIncome.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expense Entries - {year}</CardTitle>
              <div className="text-sm mt-1 space-x-4">
                <span>
                  Income:{" "}
                  <span className="font-semibold text-green-600">
                    {formatCurrency(totalIncome)}
                  </span>
                </span>
                <span>
                  Spent:{" "}
                  <span className="font-semibold text-destructive">
                    {formatCurrency(totalSpent)}
                  </span>
                </span>
              </div>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
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
          {sortedExpenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No expenses{" "}
              {selectedMonth !== "all"
                ? `for ${MONTHS[parseInt(selectedMonth) - 1]}`
                : "yet"}
            </p>
          ) : (
            <div className="overflow-auto" style={{ maxHeight: "500px" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subcategory</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedExpenses.map((expense) => {
                    const category = categories.find(
                      (c) => c.id === expense.category_id
                    );
                    const subCategory = subCategories.find(
                      (sc) => sc.id === expense.sub_category_id
                    );
                    return (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.expense_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{category?.name || "Unknown"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {subCategory?.name || "-"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {expense.description || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(expense.amount))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(expense.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editExpense} onOpenChange={() => setEditExpense(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editAmount">Amount *</Label>
              <Input
                id="editAmount"
                type="number"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategory">Category *</Label>
              <Select
                value={editCategoryId}
                onValueChange={(val) => {
                  setEditCategoryId(val);
                  setEditSubCategoryId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredSubCategories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="editSubCategory">Subcategory</Label>
                <Select
                  value={editSubCategoryId || "none"}
                  onValueChange={(val) =>
                    setEditSubCategoryId(val === "none" ? "" : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {filteredSubCategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="editDate">Date</Label>
              <Input
                id="editDate"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Input
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditExpense(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense entry. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseList;
