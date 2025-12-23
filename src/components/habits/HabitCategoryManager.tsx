import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
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

interface HabitCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
}

interface HabitCategoryManagerProps {
  userId: string;
  categories: HabitCategory[];
  onSuccess: () => void;
}

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

const HabitCategoryManager = ({
  userId,
  categories,
  onSuccess,
}: HabitCategoryManagerProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("habit_categories")
          .update({
            name: name.trim(),
            description: description.trim() || null,
            color,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase.from("habit_categories").insert({
          user_id: userId,
          name: name.trim(),
          description: description.trim() || null,
          color,
        });

        if (error) throw error;
        toast.success("Category added successfully");
      }

      setName("");
      setDescription("");
      setColor(PRESET_COLORS[0]);
      setEditingId(null);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleEdit = (category: HabitCategory) => {
    setName(category.name);
    setDescription(category.description || "");
    setColor(category.color);
    setEditingId(category.id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("habit_categories")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      toast.success("Category deleted successfully");
      setDeleteId(null);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setColor(PRESET_COLORS[0]);
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Habit Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Exercise, Reading, Meditation"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this habit..."
              rows={2}
            />
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === presetColor
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingId ? "Update Category" : "Add Category"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Categories List */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              Your Categories
            </h3>
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this category? All associated
                habit entries will also be deleted. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default HabitCategoryManager;
