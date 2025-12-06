import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { TrendingUp } from "lucide-react";

interface CarryoverDialogProps {
  userId: string;
  year: number;
  onSuccess: () => void;
  existingCarryovers: any[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CarryoverDialog = ({ userId, year, onSuccess, existingCarryovers }: CarryoverDialogProps) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!month || !amount) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const monthNum = parseInt(month);
    const existingCarryover = existingCarryovers.find(c => c.month === monthNum);

    if (existingCarryover) {
      const { error } = await supabase
        .from("monthly_carryover")
        .update({ amount: parseFloat(amount) })
        .eq("id", existingCarryover.id);
      
      setIsSubmitting(false);
      if (error) {
        toast({ title: "Error updating carryover", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Carryover updated successfully" });
        setMonth("");
        setAmount("");
        setOpen(false);
        onSuccess();
      }
    } else {
      const { error } = await supabase.from("monthly_carryover").insert({
        user_id: userId,
        year,
        month: monthNum,
        amount: parseFloat(amount),
      });

      setIsSubmitting(false);
      if (error) {
        toast({ title: "Error adding carryover", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Carryover added successfully" });
        setMonth("");
        setAmount("");
        setOpen(false);
        onSuccess();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Manage Carryover
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Monthly Carryover - {year}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground mb-4">
          Add optional carryover amounts from previous months. Positive for savings brought forward, negative for debts.
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, idx) => (
                  <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                    {m} {existingCarryovers.find(c => c.month === idx + 1) ? "(Update)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Carryover Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (positive or negative)"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Carryover"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CarryoverDialog;

