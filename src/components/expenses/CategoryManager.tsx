import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface CategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  categories: any[];
  subCategories: any[];
  onSuccess: () => void;
}

const CategoryManager = ({ open, onOpenChange, userId, categories, subCategories, onSuccess }: CategoryManagerProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editCategory, setEditCategory] = useState<any>(null);
  const [editSubCategory, setEditSubCategory] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'category' | 'subcategory' } | null>(null);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    const { error } = await supabase.from("categories").insert({
      user_id: userId,
      name: categoryName.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Category added" });
      setCategoryName("");
      onSuccess();
    }
  };

  const handleAddSubCategory = async () => {
    if (!subCategoryName.trim() || !selectedCategoryId) return;
    const { error } = await supabase.from("sub_categories").insert({
      user_id: userId,
      category_id: selectedCategoryId,
      name: subCategoryName.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sub-category added" });
      setSubCategoryName("");
      onSuccess();
    }
  };

  const handleEditCategory = (cat: any) => {
    setEditCategory(cat);
    setEditName(cat.name);
  };

  const handleEditSubCategory = (sub: any) => {
    setEditSubCategory(sub);
    setEditName(sub.name);
  };

  const handleUpdateCategory = async () => {
    if (!editCategory || !editName.trim()) return;
    const { error } = await supabase
      .from("categories")
      .update({ name: editName.trim() })
      .eq("id", editCategory.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Category updated" });
      setEditCategory(null);
      onSuccess();
    }
  };

  const handleUpdateSubCategory = async () => {
    if (!editSubCategory || !editName.trim()) return;
    const { error } = await supabase
      .from("sub_categories")
      .update({ name: editName.trim() })
      .eq("id", editSubCategory.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sub-category updated" });
      setEditSubCategory(null);
      onSuccess();
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const table = deleteItem.type === 'category' ? 'categories' : 'sub_categories';
    const { error } = await supabase.from(table).delete().eq("id", deleteItem.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${deleteItem.type === 'category' ? 'Category' : 'Sub-category'} deleted` });
      onSuccess();
    }
    setDeleteItem(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Expense Categories</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="categories">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="subcategories">Sub-categories</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
                <Button onClick={handleAddCategory} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-2 rounded-md bg-muted">
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCategory(cat)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteItem({ id: cat.id, type: 'category' })}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="subcategories" className="space-y-4">
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="New sub-category name"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  disabled={!selectedCategoryId}
                />
                <Button onClick={handleAddSubCategory} size="icon" disabled={!selectedCategoryId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {subCategories
                  .filter(sc => !selectedCategoryId || sc.category_id === selectedCategoryId)
                  .map((sub) => {
                    const parentCat = categories.find(c => c.id === sub.category_id);
                    return (
                      <div key={sub.id} className="flex items-center justify-between p-2 rounded-md bg-muted">
                        <div>
                          <span>{sub.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({parentCat?.name})</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditSubCategory(sub)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteItem({ id: sub.id, type: 'subcategory' })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                {subCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No sub-categories yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editCatName">Category Name</Label>
              <Input
                id="editCatName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateCategory} className="flex-1">Update</Button>
              <Button variant="outline" onClick={() => setEditCategory(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Sub-Category Dialog */}
      <Dialog open={!!editSubCategory} onOpenChange={() => setEditSubCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sub-Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editSubCatName">Sub-Category Name</Label>
              <Input
                id="editSubCatName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateSubCategory} className="flex-1">Update</Button>
              <Button variant="outline" onClick={() => setEditSubCategory(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteItem?.type === 'category' ? 'Category' : 'Sub-Category'}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {deleteItem?.type === 'category' ? 'category and all its sub-categories and expenses' : 'sub-category and all associated expenses'}. This action cannot be undone.
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

export default CategoryManager;
