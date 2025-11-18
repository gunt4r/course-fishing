import { NextResponse } from 'next/server';
import { getCountOrder, getCountViewers, getRegisteredUsers, getTotalRevenue, getLastOrders, getMonthlyRevenue } from '@/services/analytics/service';
export async function GET() {
try {
    const [countOrder, countViewers, registeredUsers, totalRevenue, lastOrders, monthlyRevenue] = await Promise.all([
      getCountOrder(),
      getCountViewers(),
      getRegisteredUsers(),
      getTotalRevenue(),
      getLastOrders(),
      getMonthlyRevenue(),
    ]);

    return NextResponse.json({
      countOrder,
      countViewers,
      registeredUsers,
      totalRevenue,
      lastOrders,
      monthlyRevenue,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
