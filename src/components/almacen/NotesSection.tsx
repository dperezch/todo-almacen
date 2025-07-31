"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, StickyNote } from "lucide-react";
import type { Note } from "../types/index";

interface NotesSectionProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesSection({
  notes,
  onEditNote,
  onDeleteNote,
}: NotesSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="dark:bg-slate-700 hover:shadow-md transition-shadow bg-yellow-100"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center justify-between">
              <span className="truncate">{note.title}</span>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditNote(note)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteNote(note.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-3">
              {note.content}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </CardContent>
        </Card>
      ))}
      {notes.length === 0 && (
        <Card className="md:col-span-2 lg:col-span-3 dark:bg-slate-800">
          <CardContent className="p-8 text-center">
            <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No hay notas guardadas
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Crea una nota para información importante
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
