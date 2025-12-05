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
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Category deleted" });
      onSuccess();
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    const { error } = await supabase.from("sub_categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sub-category deleted" });
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
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
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
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
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSubCategory(sub.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
  );
};

export default CategoryManager;
