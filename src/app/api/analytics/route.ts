import {
  getCountOrder,
  getCountViewers,
  getRegisteredUsers,
  getTotalRevenue,
  getLastOrders,
  getMonthlyRevenue,
} from "@/services/analytics/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const countOrder = await getCountOrder();
    const countViewers = await getCountViewers();
    const registeredUsers = await getRegisteredUsers();
    const totalRevenue = await getTotalRevenue();
    const lastOrders = await getLastOrders();
    const monthlyRevenue = await getMonthlyRevenue();
    return NextResponse.json({
      countOrder,
      countViewers,
      registeredUsers,
      totalRevenue,
      lastOrders,
      monthlyRevenue,
    });
  } catch (error) {
    throw error;
  }
}
