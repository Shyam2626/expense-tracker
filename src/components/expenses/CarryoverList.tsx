import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CarryoverListProps {
  carryovers: any[];
  year: number;
  onSuccess: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CarryoverList = ({ carryovers, year, onSuccess }: CarryoverListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editCarryover, setEditCarryover] = useState<any>(null);
  const [editAmount, setEditAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      .from("monthly_carryover")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({ title: "Error deleting carryover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Carryover deleted successfully" });
      onSuccess();
    }
    setDeleteId(null);
  };

  const handleEdit = (carryover: any) => {
    setEditCarryover(carryover);
    setEditAmount(carryover.amount.toString());
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCarryover || !editAmount) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("monthly_carryover")
      .update({ amount: parseFloat(editAmount) })
      .eq("id", editCarryover.id);

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error updating carryover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Carryover updated successfully" });
      setEditCarryover(null);
      onSuccess();
    }
  };

  const sortedCarryovers = [...carryovers].sort((a, b) => a.month - b.month);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Carryover Entries - {year}</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCarryovers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No carryover entries yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCarryovers.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {MONTHS[entry.month - 1]}
                      </TableCell>
                      <TableCell className={`text-right ${Number(entry.amount) >= 0 ? 'text-green-600' : 'text-destructive'}`}>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editCarryover} onOpenChange={() => setEditCarryover(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Carryover</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Input
                value={editCarryover ? MONTHS[editCarryover.month - 1] : ""}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editAmount">Amount</Label>
              <Input
                id="editAmount"
                type="number"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="Positive for savings, negative for debts"
                required
              />
              <p className="text-xs text-muted-foreground">
                Positive for savings brought forward, negative for overspending
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditCarryover(null)}
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
            <AlertDialogTitle>Delete Carryover?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this carryover entry. This action cannot be undone.
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

export default CarryoverList;

