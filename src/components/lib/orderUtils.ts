import type { Order, OrderStatus } from "../types/index";

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in_transit":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "received":
      return "bg-green-100 text-green-800 border-green-200";
    case "delayed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "in_transit":
      return "En tránsito";
    case "received":
      return "Recibido";
    case "delayed":
      return "Retrasado";
    default:
      return status;
  }
};

export const getOrdersForDate = (orders: Order[], date: Date): Order[] => {
  return orders.filter((order) => {
    const orderDate = new Date(order.date);
    const normalizedOrderDate = new Date(
      orderDate.getFullYear(),
      orderDate.getMonth(),
      orderDate.getDate()
    );
    const normalizedTargetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return normalizedOrderDate.getTime() === normalizedTargetDate.getTime();
  });
};

export const getTodayOrders = (orders: Order[]): Order[] => {
  const today = new Date();
  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return orders.filter((order) => {
    const orderDate = new Date(order.date);
    const normalizedOrderDate = new Date(
      orderDate.getFullYear(),
      orderDate.getMonth(),
      orderDate.getDate()
    );
    return normalizedOrderDate.getTime() === normalizedToday.getTime();
  });
};

export const getUpcomingOrders = (orders: Order[]): Order[] => {
  const today = new Date();
  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const nextWeek = new Date(normalizedToday);
  nextWeek.setDate(normalizedToday.getDate() + 7);

  return orders
    .filter((order) => {
      const orderDate = new Date(order.date);
      const normalizedOrderDate = new Date(
        orderDate.getFullYear(),
        orderDate.getMonth(),
        orderDate.getDate()
      );
      return (
        normalizedOrderDate > normalizedToday && normalizedOrderDate <= nextWeek
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
