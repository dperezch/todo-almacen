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
import { Package } from "lucide-react";
import type { Order, OrderStatus } from "../types/index";

interface OrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingOrder: Order | null;
  orderForm: {
    supplier: string;
    amount: string;
    description: string;
    date: Date;
    status: OrderStatus;
  };
  onOrderFormChange: (form: {
    supplier: string;
    amount: string;
    description: string;
    date: Date;
    status: OrderStatus;
  }) => void;
  onSubmit: () => void;
}

export function OrderDialog({
  isOpen,
  onOpenChange,
  editingOrder,
  orderForm,
  onOrderFormChange,
  onSubmit,
}: OrderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-900 text-slate-900 hover:bg-blue-50 hover:text-orange-700 hover:border-orange-600 dark:border-orange-500 dark:text-orange-500 dark:hover:bg-orange-950 bg-orange-400"
        >
          <Package className="h-4 w-4 mr-2" />
          Nuevo Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-slate-800 max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingOrder ? "Editar Pedido" : "Nuevo Pedido"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="order-supplier">Proveedor</Label>
            <Input
              id="order-supplier"
              value={orderForm.supplier}
              onChange={(e) =>
                onOrderFormChange({ ...orderForm, supplier: e.target.value })
              }
              placeholder="Ej: Distribuidora ABC"
              className="dark:bg-slate-700"
            />
          </div>
          <div>
            <Label htmlFor="order-amount">Monto Total ($)</Label>
            <Input
              id="order-amount"
              type="number"
              step="0.01"
              value={orderForm.amount}
              onChange={(e) =>
                onOrderFormChange({ ...orderForm, amount: e.target.value })
              }
              placeholder="0.00"
              className="dark:bg-slate-700"
            />
          </div>
          <div>
            <Label htmlFor="order-date">Fecha de llegada</Label>
            <Input
              id="order-date"
              type="date"
              value={orderForm.date.toISOString().split("T")[0]}
              onChange={(e) => {
                const date = new Date(e.target.value);
                const userTimezoneOffset = date.getTimezoneOffset() * 60000;
                const adjustedDate = new Date(
                  date.getTime() + userTimezoneOffset
                );
                onOrderFormChange({
                  ...orderForm,
                  date: adjustedDate,
                });
              }}
              className="dark:bg-slate-700"
            />
          </div>
          <div>
            <Label htmlFor="order-status">Estado</Label>
            <Select
              value={orderForm.status}
              onValueChange={(value: OrderStatus) =>
                onOrderFormChange({ ...orderForm, status: value })
              }
            >
              <SelectTrigger className="dark:bg-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="in_transit">En tránsito</SelectItem>
                <SelectItem value="received">Recibido</SelectItem>
                <SelectItem value="delayed">Retrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="order-description">Descripción (opcional)</Label>
            <Textarea
              id="order-description"
              value={orderForm.description}
              onChange={(e) =>
                onOrderFormChange({ ...orderForm, description: e.target.value })
              }
              placeholder="Detalles del pedido..."
              className="dark:bg-slate-700"
              rows={2}
            />
          </div>
          <Button
            onClick={onSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {editingOrder ? "Actualizar" : "Crear"} Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
