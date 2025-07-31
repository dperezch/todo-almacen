"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, AlertTriangle, Check, Edit, Trash2 } from "lucide-react";
import type { Task } from "../types/index";
import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";

interface TaskCardProps {
  task: Task;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  showDragHandle?: boolean;
}

export function TaskCard({
  task,
  provided,
  snapshot,
  onToggleComplete,
  onEdit,
  onDelete,
  showDragHandle = true,
}: TaskCardProps) {
  return (
    <Card
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={`transition-all duration-200 hover:shadow-md dark:bg-slate-800 ${
        snapshot?.isDragging ? "shadow-lg rotate-2" : ""
      } ${
        task.priority === "urgent"
          ? "border-l-4 border-l-red-500"
          : "border-l-4 border-l-blue-500"
      } ${task.completed ? "opacity-75" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {showDragHandle && provided?.dragHandleProps && (
            <div
              {...provided.dragHandleProps}
              className="mt-1 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
          )}
          {task.completed && <Check className="h-5 w-5 text-green-500 mt-1" />}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className={`text-xl font-semibold text-gray-900 dark:text-white ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`text-md text-gray-600 dark:text-gray-300 mt-1 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
              {!task.completed && (
                <div className="flex items-center gap-2 ml-4">
                  <Badge
                    variant={
                      task.priority === "urgent" ? "destructive" : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    {task.priority === "urgent" && (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {task.priority === "urgent" ? "Urgente" : "Normal"}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {task.completed ? "Completada el " : ""}
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleComplete(task.id)}
                  className={
                    task.completed
                      ? "text-blue-600 border-blue-600 hover:bg-blue-50"
                      : "text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-500"
                  }
                >
                  {task.completed ? "Reactivar" : <Check className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
