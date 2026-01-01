import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon, Edit2, Save, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DailyNote {
  date: string;
  note: string;
  entry_id: string;
}

interface DailyNotesProps {
  userId: string;
  year: number;
  month: number;
  onSuccess: () => void;
}

const DailyNotes = ({ userId, year, month, onSuccess }: DailyNotesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [deleteDate, setDeleteDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch notes for the selected date
  const fetchNoteForDate = async (date: Date) => {
    setIsLoading(true);
    const dateStr = format(date, "yyyy-MM-dd");
    
    try {
      const { data, error } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("user_id", userId)
        .eq("note_date", dateStr)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned

      if (data) {
        setCurrentNote(data.content);
        setEditingDate(dateStr);
      } else {
        setCurrentNote("");
        setEditingDate(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all notes for the month
  const fetchMonthNotes = async () => {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    try {
      const { data, error } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("user_id", userId)
        .gte("note_date", startDate)
        .lte("note_date", endDate)
        .order("note_date", { ascending: false });

      if (error) throw error;

      if (data) {
        setNotes(data.map(entry => ({
          date: entry.note_date,
          note: entry.content,
          entry_id: entry.id,
        })));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch notes");
    }
  };

  // Save or update note
  const handleSaveNote = async () => {
    if (!selectedDate || !currentNote.trim()) {
      toast.error("Please select a date and enter a note");
      return;
    }

    setIsSaving(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    try {
      // Upsert (insert or update) the note
      const { error } = await supabase
        .from("daily_notes")
        .upsert({
          user_id: userId,
          note_date: dateStr,
          content: currentNote,
        }, {
          onConflict: "user_id,note_date"
        });

      if (error) throw error;

      toast.success("Note saved successfully");
      setEditingDate(null);
      fetchMonthNotes();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete note
  const handleDeleteNote = async () => {
    if (!deleteDate) return;

    try {
      const { error } = await supabase
        .from("daily_notes")
        .delete()
        .eq("user_id", userId)
        .eq("note_date", deleteDate);

      if (error) throw error;

      toast.success("Note deleted successfully");
      setDeleteDate(null);
      fetchMonthNotes();
      if (selectedDate && format(selectedDate, "yyyy-MM-dd") === deleteDate) {
        setCurrentNote("");
        setEditingDate(null);
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete note");
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchNoteForDate(date);
    }
  };

  // Load notes when component mounts or month/year changes
  useEffect(() => {
    fetchMonthNotes();
    if (selectedDate) {
      fetchNoteForDate(selectedDate);
    }
  }, [year, month]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Daily Notes - {year}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Note Editor */}
          {selectedDate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Note for {format(selectedDate, "MMMM d, yyyy")}
                </label>
                {editingDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentNote("");
                      setEditingDate(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
              <Textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="What did you do today? How did you feel? Any reflections?"
                className="min-h-[200px]"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNote}
                  disabled={isSaving || !currentNote.trim()}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Note"}
                </Button>
                {editingDate && (
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDate(format(selectedDate, "yyyy-MM-dd"))}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-2 mt-6">
            <h3 className="text-sm font-medium">
              Notes for {format(new Date(year, month - 1), "MMMM yyyy")}
            </h3>
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes for this month yet
              </p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {notes.map((note) => (
                  <Card key={note.date} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">
                          {format(new Date(note.date), "MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {note.note}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDate(new Date(note.date));
                            setCurrentNote(note.note);
                            setEditingDate(note.date);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteDate(note.date)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDate} onOpenChange={() => setDeleteDate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DailyNotes;

