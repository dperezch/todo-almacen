export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "normal" | "urgent";
  completed: boolean;
  createdAt: Date;
  order: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  supplier: string;
  amount: number;
  description?: string;
  date: Date;
  status: "pending" | "in_transit" | "received" | "delayed";
  createdAt: Date;
}

export type TaskSubTab = "pendientes" | "completadas";
export type CalendarView = "current" | "next";
export type OrderStatus = "pending" | "in_transit" | "received" | "delayed";
