import { getDataSource } from "@/libs/DB";
import { Cart } from "@/models/cart";
import { Order } from "@/models/order";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function getCountViewers(): Promise<number> {
  try {
    const dataSource = await getDataSource();
    const cartRepo = dataSource.getRepository(Cart);

    const countViewers = await cartRepo.count();

    if (!countViewers) {
      throw Error("Count viewers not found");
    }
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

    if (!countOrder) {
      throw Error("Count order not found");
    }
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

    if (!registeredUsers) {
      throw Error("Registered users not found");
    }
    return registeredUsers;
  } catch (error) {
    throw error;
  }
}

export async function getTotalRevenue(): Promise<number> {
  try {
    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);

    const totalRevenue = await orderRepo
      .createQueryBuilder("o")
      .select("SUM(o.totalAmount)", "total")
      .where("o.status = :status", { status: "completed" })
      .getRawOne();

    if (!totalRevenue || !totalRevenue.total) {
      throw Error("Total revenue not found");
    }
    return Number(totalRevenue.total);
  } catch (error) {
    throw error;
  }
}

export async function getLastOrders(): Promise<Order[]> {
  try {
    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);

    const lastOrders = await orderRepo.find({
      order: { createdAt: "DESC" },
      take: 5,
    });

    if (!lastOrders) {
      throw Error("Last orders not found");
    }
    return lastOrders;
  } catch (error) {
    throw error;
  }
}

export async function getMonthlyRevenue(): Promise<number[]> {
  try {
    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);

    const monthlyRevenue = await orderRepo
      .createQueryBuilder("o")
      .select("EXTRACT(MONTH FROM o.createdAt)", "month")
      .addSelect("SUM(o.totalAmount)", "total")
      .where("o.status = :status", { status: "completed" })
      .groupBy("EXTRACT(MONTH FROM o.createdAt)")
      .orderBy("month", "ASC")
      .getRawMany();

    if (!monthlyRevenue) {
      throw Error("Monthly revenue not found");
    }
    return monthlyRevenue;
  } catch (error) {
    throw error;
  }
}
