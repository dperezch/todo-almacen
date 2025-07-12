"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  Clock,
  StickyNote,
  Sun,
  Moon,
  GripVertical,
  Package,
  ShoppingCart,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "normal" | "urgent";
  completed: boolean;
  createdAt: Date;
  order: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function TodoAlmacen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("pendientes");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "normal" as "normal" | "urgent",
  });

  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("almacen-tasks");
    const savedNotes = localStorage.getItem("almacen-notes");
    const savedTheme = localStorage.getItem("almacen-theme");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("almacen-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("almacen-notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("almacen-theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const addTask = () => {
    if (!taskForm.title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      completed: false,
      createdAt: new Date(),
      order: tasks.length,
    };

    setTasks([...tasks, newTask]);
    setTaskForm({ title: "", description: "", priority: "normal" });
    setIsTaskDialogOpen(false);
  };

  const updateTask = () => {
    if (!editingTask || !taskForm.title.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: taskForm.title,
              description: taskForm.description,
              priority: taskForm.priority,
            }
          : task
      )
    );

    setEditingTask(null);
    setTaskForm({ title: "", description: "", priority: "normal" });
    setIsTaskDialogOpen(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addNote = () => {
    if (!noteForm.title.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteForm.title,
      content: noteForm.content,
      createdAt: new Date(),
    };

    setNotes([...notes, newNote]);
    setNoteForm({ title: "", content: "" });
    setIsNoteDialogOpen(false);
  };

  const updateNote = () => {
    if (!editingNote || !noteForm.title.trim()) return;

    setNotes(
      notes.map((note) =>
        note.id === editingNote.id
          ? { ...note, title: noteForm.title, content: noteForm.content }
          : note
      )
    );

    setEditingNote(null);
    setNoteForm({ title: "", content: "" });
    setIsNoteDialogOpen(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });
    setIsTaskDialogOpen(true);
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
    });
    setIsNoteDialogOpen(true);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(getFilteredTasks());
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order for all tasks
    const updatedTasks = tasks.map((task) => {
      const newIndex = items.findIndex((item) => item.id === task.id);
      return newIndex !== -1 ? { ...task, order: newIndex } : task;
    });

    setTasks(updatedTasks);
  };

  const getFilteredTasks = () => {
    const filtered =
      activeTab === "pendientes"
        ? tasks.filter((task) => !task.completed)
        : tasks.filter((task) => task.completed);

    return filtered.sort((a, b) => a.order - b.order);
  };

  const resetDialogForms = () => {
    setTaskForm({ title: "", description: "", priority: "normal" });
    setNoteForm({ title: "", content: "" });
    setEditingTask(null);
    setEditingNote(null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "dark bg-slate-900"
          : "bg-gradient-to-br from-blue-50 to-green-50"
      }`}
    >
      {/* Header with background image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-green-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=800')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Gestión de Almacén
              </h1>
              <p className="text-blue-100">
                Organiza tus tareas y recordatorios
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Sun className="h-4 w-4 text-yellow-300" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-slate-700"
              />
              <Moon className="h-4 w-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-white dark:bg-slate-800 shadow-sm">
              <TabsTrigger
                value="pendientes"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Pendientes ({tasks.filter((t) => !t.completed).length})
              </TabsTrigger>
              <TabsTrigger
                value="completadas"
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Completadas ({tasks.filter((t) => t.completed).length})
              </TabsTrigger>
              <TabsTrigger value="notas" className="flex items-center gap-2">
                <StickyNote className="h-4 w-4" />
                Notas ({notes.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Dialog
                open={isTaskDialogOpen}
                onOpenChange={(open) => {
                  setIsTaskDialogOpen(open);
                  if (!open) resetDialogForms();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
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
                          setTaskForm({ ...taskForm, title: e.target.value })
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
                          setTaskForm({
                            ...taskForm,
                            description: e.target.value,
                          })
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
                          setTaskForm({ ...taskForm, priority: value })
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
                      onClick={editingTask ? updateTask : addTask}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {editingTask ? "Actualizar" : "Crear"} Tarea
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isNoteDialogOpen}
                onOpenChange={(open) => {
                  setIsNoteDialogOpen(open);
                  if (!open) resetDialogForms();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950 bg-transparent"
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
                          setNoteForm({ ...noteForm, title: e.target.value })
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
                          setNoteForm({ ...noteForm, content: e.target.value })
                        }
                        placeholder="Escribe tu nota aquí..."
                        rows={4}
                        className="dark:bg-slate-700"
                      />
                    </div>
                    <Button
                      onClick={editingNote ? updateNote : addNote}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {editingNote ? "Actualizar" : "Crear"} Nota
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="pendientes" className="space-y-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="pendientes">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {getFilteredTasks().map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-all duration-200 hover:shadow-md dark:bg-slate-800 ${
                              snapshot.isDragging ? "shadow-lg rotate-2" : ""
                            } ${
                              task.priority === "urgent"
                                ? "border-l-4 border-l-red-500"
                                : "border-l-4 border-l-blue-500"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-1 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="lg:text-2xl font-semibold text-gray-900 dark:text-white">
                                        {task.title}
                                      </h3>
                                      {task.description && (
                                        <p className="lg:text-xl text-sm text-gray-600 dark:text-gray-300 mt-1">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                      <Badge
                                        variant={
                                          task.priority === "urgent"
                                            ? "destructive"
                                            : "secondary"
                                        }
                                        className="flex items-center gap-1"
                                      >
                                        {task.priority === "urgent" && (
                                          <AlertTriangle className="h-3 w-3" />
                                        )}
                                        {task.priority === "urgent"
                                          ? "Urgente"
                                          : "Normal"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(
                                        task.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          toggleTaskComplete(task.id)
                                        }
                                        className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-500"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditTask(task)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => deleteTask(task.id)}
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {getFilteredTasks().length === 0 && (
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
          </TabsContent>

          <TabsContent value="completadas" className="space-y-4">
            <div className="space-y-3">
              {getFilteredTasks().map((task) => (
                <Card key={task.id} className="opacity-75 dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white line-through">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-through">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Completada el{" "}
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleTaskComplete(task.id)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              Reactivar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteTask(task.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getFilteredTasks().length === 0 && (
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
          </TabsContent>

          <TabsContent value="notas" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className="bg-yellow-100 dark:bg-slate-800 hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="lg:text-2xl text-lg flex items-center justify-between">
                      <span className="truncate">{note.title}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="lg:text-xl text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-3">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
