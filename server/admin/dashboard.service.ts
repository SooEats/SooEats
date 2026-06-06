import "server-only";

import { getPrisma } from "@/lib/prisma";

export async function getAdminDashboardMetrics() {
  const prisma = getPrisma();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [ordersToday, pendingOrders, completedOrders, menuItems, lowStockItems, revenue, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.menuItem.count({ where: { archivedAt: null } }),
      prisma.menuItem.count({
        where: { archivedAt: null, stockQuantity: { not: null, lte: 5 } },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: "SUCCEEDED" },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

  return {
    ordersToday,
    pendingOrders,
    completedOrders,
    menuItems,
    lowStockItems,
    revenue: Number(revenue._sum.total ?? 0),
    recentOrders,
  };
}
