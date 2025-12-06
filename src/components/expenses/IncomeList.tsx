import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface IncomeListProps {
  income: any[];
  incomeCategories: any[];
  year: number;
  onSuccess: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const IncomeList = ({ income, incomeCategories, year, onSuccess }: IncomeListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editIncome, setEditIncome] = useState<any>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

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
      .from("monthly_income")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({ title: "Error deleting income", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Income deleted successfully" });
      onSuccess();
    }
    setDeleteId(null);
  };

  const handleEdit = (incomeEntry: any) => {
    setEditIncome(incomeEntry);
    setEditAmount(incomeEntry.amount.toString());
    setEditCategoryId(incomeEntry.income_category_id);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editIncome || !editAmount || !editCategoryId) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("monthly_income")
      .update({
        amount: parseFloat(editAmount),
        income_category_id: editCategoryId,
      })
      .eq("id", editIncome.id);

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error updating income", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Income updated successfully" });
      setEditIncome(null);
      onSuccess();
    }
  };

  const filteredIncome = selectedMonth === "all" 
    ? income 
    : income.filter(i => i.month === parseInt(selectedMonth));
  
  const sortedIncome = [...filteredIncome].sort((a, b) => a.month - b.month);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Income Entries - {year}</CardTitle>
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
          {sortedIncome.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No income entries {selectedMonth !== "all" ? `for ${MONTHS[parseInt(selectedMonth) - 1]}` : "yet"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedIncome.map((entry) => {
                    const category = incomeCategories.find(c => c.id === entry.income_category_id);
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {MONTHS[entry.month - 1]}
                        </TableCell>
                        <TableCell>{category?.name || "Unknown"}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(entry.amount))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(entry)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(entry.id)}
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
      <Dialog open={!!editIncome} onOpenChange={() => setEditIncome(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Input
                value={editIncome ? MONTHS[editIncome.month - 1] : ""}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategory">Income Category</Label>
              <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {incomeCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editAmount">Amount</Label>
              <Input
                id="editAmount"
                type="number"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditIncome(null)}
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
            <AlertDialogTitle>Delete Income Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this income entry. This action cannot be undone.
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

export default IncomeList;

