import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";
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

interface IncomeCategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  incomeCategories: any[];
  onSuccess: () => void;
}

const IncomeCategoryManager = ({ open, onOpenChange, userId, incomeCategories, onSuccess }: IncomeCategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [editName, setEditName] = useState("");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({ title: "Please enter a category name", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("income_categories").insert({
      user_id: userId,
      name: newCategoryName.trim(),
    });

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error adding category", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Income category added successfully" });
      setNewCategoryName("");
      onSuccess();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("income_categories")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({ title: "Error deleting category", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Income category deleted successfully" });
      onSuccess();
    }
    setDeleteId(null);
  };

  const handleEdit = (category: any) => {
    setEditCategory(category);
    setEditName(category.name);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory || !editName.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("income_categories")
      .update({ name: editName.trim() })
      .eq("id", editCategory.id);

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error updating category", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Income category updated successfully" });
      setEditCategory(null);
      onSuccess();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Income Categories</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newCategory">Add New Income Category</Label>
                <div className="flex gap-2">
                  <Input
                    id="newCategory"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Salary, Stocks, Freelancing, Rental"
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </form>

            <div className="space-y-2">
              <Label>Existing Income Categories</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {incomeCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No income categories yet</p>
                ) : (
                  incomeCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{category.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Category Name</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., Salary, Stocks, Freelancing"
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
                onClick={() => setEditCategory(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Income Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the income category and all associated income entries. This action cannot be undone.
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

export default IncomeCategoryManager;

