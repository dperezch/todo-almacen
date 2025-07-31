"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Edit, Trash2, Package } from "lucide-react";
import { getWeekDates } from "../lib/dateUtils";
import {
  getOrdersForDate,
  getTodayOrders,
  getUpcomingOrders,
  getStatusColor,
  getStatusText,
} from "../lib/orderUtils";
import type { Order, CalendarView } from "../types/index";

interface OrdersSectionProps {
  orders: Order[];
  calendarView: CalendarView;
  onCalendarViewChange: (view: CalendarView) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

export function OrdersSection({
  orders,
  calendarView,
  onCalendarViewChange,
  onEditOrder,
  onDeleteOrder,
}: OrdersSectionProps) {
  const todayOrders = getTodayOrders(orders);
  const upcomingOrders = getUpcomingOrders(orders);

  return (
    <div className="space-y-6">
      {/* Resumen de pedidos de hoy */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="dark:bg-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Pedidos de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayOrders.length > 0 ? (
              <div className="space-y-2">
                {todayOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950 rounded"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.supplier}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        ${order.amount.toFixed(2)}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay pedidos para hoy
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Próximos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingOrders.length > 0 ? (
              <div className="space-y-2">
                {upcomingOrders.slice(0, 3).map((order) => {
                  // --- INICIO DE LA MODIFICACIÓN ---
                  const orderDate = new Date(order.date);
                  // Obtenemos el nombre del día en español y capitalizamos la primera letra
                  const dayName = orderDate
                    .toLocaleDateString("es-ES", { weekday: "long" })
                    .replace(/^\w/, (c) => c.toUpperCase());
                  // Obtenemos la fecha en formato numérico local
                  const dateString = orderDate.toLocaleDateString();
                  // --- FIN DE LA MODIFICACIÓN ---

                  return (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-950 rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{order.supplier}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {/* Mostramos el día junto a la fecha */}
                          {dayName} {dateString} - ${order.amount.toFixed()}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay pedidos próximos
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navegación del calendario */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant={calendarView === "current" ? "default" : "outline"}
            onClick={() => onCalendarViewChange("current")}
            className={`text-sm ${
              calendarView === "current"
                ? "bg-emerald-600 text-white hover:bg-emerald-800"
                : ""
            }`}
          >
            Semana Actual
          </Button>
          <Button
            variant={calendarView === "next" ? "default" : "outline"}
            onClick={() => onCalendarViewChange("next")}
            className={`text-sm ${
              calendarView === "next"
                ? "bg-amber-600 text-white hover:bg-amber-800"
                : ""
            }`}
          >
            Próxima Semana
          </Button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {calendarView === "current" ? "Semana Actual" : "Próxima Semana"}
        </div>
      </div>

      {/* Calendario */}
      <Card className="dark:bg-slate-800">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 gap-0">
            {/* Encabezados de días */}
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
              <div
                key={day}
                className="p-3 text-center font-medium text-sm bg-gray-50 dark:bg-slate-700 border-b border-r border-gray-200 dark:border-slate-600"
              >
                {day}
              </div>
            ))}

            {/* Días del calendario */}
            {getWeekDates(calendarView === "current" ? 0 : 1).map(
              (date, index) => {
                const dayOrders = getOrdersForDate(orders, date);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isPast = date < new Date() && !isToday;

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-slate-600 ${
                      isToday
                        ? "bg-blue-100 dark:bg-blue-950"
                        : isPast
                        ? "bg-gray-50 dark:bg-slate-700"
                        : "bg-white dark:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isToday
                          ? "text-blue-600"
                          : isPast
                          ? "text-gray-400"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayOrders.map((order) => (
                        <div
                          key={order.id}
                          className="text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-shadow bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600"
                          onClick={() => onEditOrder(order)}
                        >
                          <div className="font-medium truncate">
                            {order.supplier}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            ${order.amount.toFixed()}
                          </div>
                          <Badge
                            className={`text-xs ${getStatusColor(
                              order.status
                            )} mt-1`}
                          >
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de todos los pedidos */}
      <Card className="dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Todos los Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{order.supplier}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.date).toLocaleDateString()} - $
                            {order.amount.toFixed(2)}
                          </p>
                          {order.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {order.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteOrder(order.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay pedidos registrados
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Crea tu primer pedido para comenzar
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
