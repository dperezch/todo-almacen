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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Task } from "../types/index";

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: Task | null;
  taskForm: {
    title: string;
    description: string;
    priority: "normal" | "urgent";
  };
  onTaskFormChange: (form: {
    title: string;
    description: string;
    priority: "normal" | "urgent";
  }) => void;
  onSubmit: () => void;
}

export function TaskDialog({
  isOpen,
  onOpenChange,
  editingTask,
  taskForm,
  onTaskFormChange,
  onSubmit,
}: TaskDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 border-black hover:bg-blue-200 hover:text-blue-800 hover:border-blue-800 dark:text-slate-50 dark:bg-blue-700 dark:hover:bg-blue-800">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? "Editar Tarea" : "Nueva Tarea"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">Título</Label>
            <Input
              id="task-title"
              value={taskForm.title}
              onChange={(e) =>
                onTaskFormChange({ ...taskForm, title: e.target.value })
              }
              placeholder="Ej: Revisar inventario de productos"
              className="dark:bg-slate-700"
            />
          </div>
          <div>
            <Label htmlFor="task-description">Descripción</Label>
            <Textarea
              id="task-description"
              value={taskForm.description}
              onChange={(e) =>
                onTaskFormChange({ ...taskForm, description: e.target.value })
              }
              placeholder="Detalles adicionales..."
              className="dark:bg-slate-700"
            />
          </div>
          <div>
            <Label htmlFor="task-priority">Prioridad</Label>
            <Select
              value={taskForm.priority}
              onValueChange={(value: "normal" | "urgent") =>
                onTaskFormChange({ ...taskForm, priority: value })
              }
            >
              <SelectTrigger className="dark:bg-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onSubmit}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {editingTask ? "Actualizar" : "Crear"} Tarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
