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

interface AddIncomeDialogProps {
  userId: string;
  year: number;
  onSuccess: () => void;
  existingIncome: any[];
  incomeCategories: any[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AddIncomeDialog = ({ userId, year, onSuccess, existingIncome, incomeCategories }: AddIncomeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [incomeCategoryId, setIncomeCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!month || !amount || !incomeCategoryId) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const monthNum = parseInt(month);
    
    const { error } = await supabase.from("monthly_income").insert({
      user_id: userId,
      year,
      month: monthNum,
      income_category_id: incomeCategoryId,
      amount: parseFloat(amount),
    });

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error adding income", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Income added successfully" });
      setMonth("");
      setAmount("");
      setIncomeCategoryId("");
      setOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wallet className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Monthly Income - {year}</DialogTitle>
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
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incomeCategory">Income Category</Label>
            <Select value={incomeCategoryId} onValueChange={setIncomeCategoryId}>
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
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter income amount"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Income"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeDialog;

