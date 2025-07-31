"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, StickyNote, Package } from "lucide-react";

import { Header } from "@/components/almacen/Header";
import { TaskDialog } from "@/components/almacen/TaskDialog";
import { NoteDialog } from "@/components/almacen/NoteDialog";
import { OrderDialog } from "@/components/almacen/OrderDialog";
import { TasksSection } from "@/components/almacen/TasksSection";
import { NotesSection } from "@/components/almacen/NotesSection";
import { OrdersSection } from "@/components/almacen/OrdersSection";

import { useLocalStorage } from "../components/hooks/useLocalStorage";
import { normalizeDate } from "../components/lib/dateUtils";
import type {
  Task,
  Note,
  Order,
  TaskSubTab,
  CalendarView,
  OrderStatus,
} from "../components/types/index";
import { DropResult } from "@hello-pangea/dnd";

export default function TodoAlmacen() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("almacen-tasks", []);
  const [notes, setNotes] = useLocalStorage<Note[]>("almacen-notes", []);
  const [orders, setOrders] = useLocalStorage<Order[]>("almacen-orders", []);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(
    "almacen-theme",
    false
  );

  const [activeTab, setActiveTab] = useState("tareas");
  const [taskSubTab, setTaskSubTab] = useState<TaskSubTab>("pendientes");
  const [calendarView, setCalendarView] = useState<CalendarView>("current");

  // Dialog states
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Editing states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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

  const [orderForm, setOrderForm] = useState({
    supplier: "",
    amount: "",
    description: "",
    date: new Date(),
    status: "pending" as OrderStatus,
  });

  // Apply dark mode - only runs when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Task functions
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
    resetTaskForm();
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

    resetTaskForm();
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

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });
    setIsTaskDialogOpen(true);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const pendingTasks = tasks
      .filter((task) => !task.completed)
      .sort((a, b) => a.order - b.order);
    const items = Array.from(pendingTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedTasks = tasks.map((task) => {
      const newIndex = items.findIndex((item) => item.id === task.id);
      return newIndex !== -1 ? { ...task, order: newIndex } : task;
    });

    setTasks(updatedTasks);
  };

  // Note functions
  const addNote = () => {
    if (!noteForm.title.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteForm.title,
      content: noteForm.content,
      createdAt: new Date(),
    };

    setNotes([...notes, newNote]);
    resetNoteForm();
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

    resetNoteForm();
    setIsNoteDialogOpen(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
    });
    setIsNoteDialogOpen(true);
  };

  // Order functions
  const addOrder = () => {
    if (!orderForm.supplier.trim() || !orderForm.amount) return;

    const normalizedDate = normalizeDate(orderForm.date);

    const newOrder: Order = {
      id: Date.now().toString(),
      supplier: orderForm.supplier,
      amount: Number.parseFloat(orderForm.amount),
      description: orderForm.description,
      date: normalizedDate,
      status: orderForm.status,
      createdAt: new Date(),
    };

    setOrders([...orders, newOrder]);
    resetOrderForm();
    setIsOrderDialogOpen(false);
  };

  const updateOrder = () => {
    if (!editingOrder || !orderForm.supplier.trim() || !orderForm.amount)
      return;

    const normalizedDate = normalizeDate(orderForm.date);

    setOrders(
      orders.map((order) =>
        order.id === editingOrder.id
          ? {
              ...order,
              supplier: orderForm.supplier,
              amount: Number.parseFloat(orderForm.amount),
              description: orderForm.description,
              date: normalizedDate,
              status: orderForm.status,
            }
          : order
      )
    );

    resetOrderForm();
    setIsOrderDialogOpen(false);
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const openEditOrder = (order: Order) => {
    setEditingOrder(order);
    setOrderForm({
      supplier: order.supplier,
      amount: order.amount.toString(),
      description: order.description || "",
      date: new Date(order.date),
      status: order.status,
    });
    setIsOrderDialogOpen(true);
  };

  // Reset form functions
  const resetTaskForm = () => {
    setTaskForm({ title: "", description: "", priority: "normal" });
    setEditingTask(null);
  };

  const resetNoteForm = () => {
    setNoteForm({ title: "", content: "" });
    setEditingNote(null);
  };

  const resetOrderForm = () => {
    setOrderForm({
      supplier: "",
      amount: "",
      description: "",
      date: new Date(),
      status: "pending",
    });
    setEditingOrder(null);
  };

  const resetAllForms = () => {
    resetTaskForm();
    resetNoteForm();
    resetOrderForm();
  };

  // Handle theme toggle
  const handleToggleDarkMode = (newDarkMode: boolean) => {
    setDarkMode(newDarkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "dark bg-slate-900"
          : "bg-gradient-to-br from-blue-50 to-green-50"
      }`}
    >
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-white dark:bg-slate-800 shadow-sm">
              <TabsTrigger value="tareas" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tareas ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="notas" className="flex items-center gap-2">
                <StickyNote className="h-4 w-4" />
                Notas ({notes.length})
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Pedidos ({orders.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <TaskDialog
                isOpen={isTaskDialogOpen}
                onOpenChange={(open) => {
                  setIsTaskDialogOpen(open);
                  if (!open) resetAllForms();
                }}
                editingTask={editingTask}
                taskForm={taskForm}
                onTaskFormChange={setTaskForm}
                onSubmit={editingTask ? updateTask : addTask}
              />

              <NoteDialog
                isOpen={isNoteDialogOpen}
                onOpenChange={(open) => {
                  setIsNoteDialogOpen(open);
                  if (!open) resetAllForms();
                }}
                editingNote={editingNote}
                noteForm={noteForm}
                onNoteFormChange={setNoteForm}
                onSubmit={editingNote ? updateNote : addNote}
              />

              <OrderDialog
                isOpen={isOrderDialogOpen}
                onOpenChange={(open) => {
                  setIsOrderDialogOpen(open);
                  if (!open) resetAllForms();
                }}
                editingOrder={editingOrder}
                orderForm={orderForm}
                onOrderFormChange={setOrderForm}
                onSubmit={editingOrder ? updateOrder : addOrder}
              />
            </div>
          </div>

          <TabsContent value="tareas">
            <TasksSection
              tasks={tasks}
              taskSubTab={taskSubTab}
              onTaskSubTabChange={setTaskSubTab}
              onDragEnd={handleDragEnd}
              onToggleComplete={toggleTaskComplete}
              onEditTask={openEditTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="notas">
            <NotesSection
              notes={notes}
              onEditNote={openEditNote}
              onDeleteNote={deleteNote}
            />
          </TabsContent>

          <TabsContent value="pedidos">
            <OrdersSection
              orders={orders}
              calendarView={calendarView}
              onCalendarViewChange={setCalendarView}
              onEditOrder={openEditOrder}
              onDeleteOrder={deleteOrder}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
