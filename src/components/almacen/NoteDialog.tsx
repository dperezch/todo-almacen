"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StickyNote } from "lucide-react";
import type { Note } from "../types/index";

interface NoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote: Note | null;
  noteForm: {
    title: string;
    content: string;
  };
  onNoteFormChange: (form: { title: string; content: string }) => void;
  onSubmit: () => void;
}

export function NoteDialog({
  isOpen,
  onOpenChange,
  editingNote,
  noteForm,
  onNoteFormChange,
  onSubmit,
}: NoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-800 text-slate-800 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950 bg-yellow-200"
        >
          <StickyNote className="h-4 w-4 mr-2" />
          Nueva Nota
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>
            {editingNote ? "Editar Nota" : "Nueva Nota"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="note-title">Título</Label>
            <Input
              id="note-title"
              value={noteForm.title}
              onChange={(e) =>
                onNoteFormChange({ ...noteForm, title: e.target.value })
              }
              placeholder="Ej: Información importante"
              className="dark:bg-slate-700"
            />
          </div>
          <div>
            <Label htmlFor="note-content">Contenido</Label>
            <Textarea
              id="note-content"
              value={noteForm.content}
              onChange={(e) =>
                onNoteFormChange({ ...noteForm, content: e.target.value })
              }
              placeholder="Escribe tu nota aquí..."
              rows={4}
              className="dark:bg-slate-700"
            />
          </div>
          <Button
            onClick={onSubmit}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {editingNote ? "Actualizar" : "Crear"} Nota
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
