"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Check, ShoppingCart } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import type { Task, TaskSubTab } from "../types/index";

interface TasksSectionProps {
  tasks: Task[];
  taskSubTab: TaskSubTab;
  onTaskSubTabChange: (tab: TaskSubTab) => void;
  onDragEnd: (result: DropResult) => void;
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function TasksSection({
  tasks,
  taskSubTab,
  onTaskSubTabChange,
  onDragEnd,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: TasksSectionProps) {
  const pendingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => a.order - b.order);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-4">
      {/* Sub-navegación para tareas */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={taskSubTab === "pendientes" ? "default" : "outline"}
          onClick={() => onTaskSubTabChange("pendientes")}
          className={`text-sm ${
            taskSubTab === "pendientes"
              ? "bg-amber-400 text-black hover:bg-amber-800 hover:text-white"
              : ""
          }`}
        >
          <Clock className="h-4 w-4 mr-2" />
          Pendientes ({pendingTasks.length})
        </Button>
        <Button
          variant={taskSubTab === "completadas" ? "default" : "outline"}
          onClick={() => onTaskSubTabChange("completadas")}
          className={`text-sm ${
            taskSubTab === "completadas"
              ? "bg-emerald-400 text-black hover:bg-emerald-800 hover:text-white"
              : ""
          }`}
        >
          <Check className="h-4 w-4 mr-2" />
          Completadas ({completedTasks.length})
        </Button>
      </div>

      {/* Contenido de tareas pendientes */}
      {taskSubTab === "pendientes" && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="pendientes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {pendingTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <TaskCard
                        task={task}
                        provided={provided}
                        snapshot={snapshot}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        showDragHandle={true}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {pendingTasks.length === 0 && (
                  <Card className="dark:bg-slate-800">
                    <CardContent className="p-8 text-center">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No hay tareas pendientes
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        ¡Excelente trabajo!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Contenido de tareas completadas */}
      {taskSubTab === "completadas" && (
        <div className="space-y-3">
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              showDragHandle={false}
            />
          ))}
          {completedTasks.length === 0 && (
            <Card className="dark:bg-slate-800">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No hay tareas completadas
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Completa algunas tareas para verlas aquí
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
