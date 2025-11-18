import { getDataSource } from '@/libs/DB';
import { Cart } from '@/models/cart';
import { Order } from '@/models/order';
import { User } from '@/models/user';

export async function getCountViewers(): Promise<number> {
  try {
    const dataSource = await getDataSource();
    const cartRepo = dataSource.getRepository(Cart);

    const countViewers = await cartRepo.count();

    return countViewers;
  } catch (error) {
    throw error;
  }
}

export async function getCountOrder(): Promise<number> {
  try {
    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);

    const countOrder = await orderRepo.count();

    return countOrder;
  } catch (error) {
    throw error;
  }
}

export async function getRegisteredUsers(): Promise<number> {
  try {
    const dataSource = await getDataSource();
    const userRepo = dataSource.getRepository(User);

    const registeredUsers = await userRepo.count();

    return registeredUsers;
  } catch (error) {
    throw error;
  }
}

export async function getTotalRevenue(): Promise<number> {
  try {
    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);

    if (Number(orderRepo.count()) === 0) return 0;

    const totalRevenue = await orderRepo
      .createQueryBuilder('o')
      .select('SUM(o.totalAmount)', 'total')
      .where('o.status = :status', { status: 'completed' })
      .getRawOne();

    if (!totalRevenue || !totalRevenue.total) {
      throw new Error('Total revenue not found');
    }
    return Number(totalRevenue?.total ?? 0);
  } catch (error) {
    throw error;
  }
}

export async function getLastOrders(): Promise<Order[]> {
  try {
    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);

    const lastOrders = await orderRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return lastOrders;
  } catch (error) {
    throw error;
  }
}

export async function getMonthlyRevenue(): Promise<number[]> {
  try {
    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);

    if (Number(orderRepo.count()) === 0) return [];
    
    const monthlyRevenue = await orderRepo
      .createQueryBuilder('o')
      .select('EXTRACT(MONTH FROM o.createdAt)', 'month')
      .addSelect('SUM(o.totalAmount)', 'total')
      .where('o.status = :status', { status: 'completed' })
      .groupBy('EXTRACT(MONTH FROM o.createdAt)')
      .orderBy('month', 'ASC')
      .getRawMany();

    return monthlyRevenue ?? [];
  } catch (error) {
    throw error;
  }
}
