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
import { Wallet } from "lucide-react";

interface AddSalaryDialogProps {
  userId: string;
  year: number;
  onSuccess: () => void;
  existingSalaries: any[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AddSalaryDialog = ({ userId, year, onSuccess, existingSalaries }: AddSalaryDialogProps) => {
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
    const existingSalary = existingSalaries.find(s => s.month === monthNum);

    if (existingSalary) {
      const { error } = await supabase
        .from("monthly_salaries")
        .update({ amount: parseFloat(amount) })
        .eq("id", existingSalary.id);
      
      setIsSubmitting(false);
      if (error) {
        toast({ title: "Error updating salary", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Salary updated successfully" });
        setMonth("");
        setAmount("");
        setOpen(false);
        onSuccess();
      }
    } else {
      const { error } = await supabase.from("monthly_salaries").insert({
        user_id: userId,
        year,
        month: monthNum,
        amount: parseFloat(amount),
      });

      setIsSubmitting(false);
      if (error) {
        toast({ title: "Error adding salary", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Salary added successfully" });
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
          <Wallet className="h-4 w-4 mr-2" />
          Add Salary
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add/Update Monthly Salary - {year}</DialogTitle>
        </DialogHeader>
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
                    {m} {existingSalaries.find(s => s.month === idx + 1) ? "(Update)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Salary Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter salary amount"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Salary"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSalaryDialog;
