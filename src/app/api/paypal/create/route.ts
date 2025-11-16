import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/services/paypal/service";
import { getOrderById } from "@/services/order/service";
export async function POST(request: NextRequest) {
  try {
    const body: { orderId?: string } = await request.json();
    const { orderId } = body;

    if (
      !orderId ||
      typeof orderId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        orderId,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid order ID format" },
        { status: 400 },
      );
    }
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.log(order);
    if (order.totalAmount <= 0 || isNaN(order.totalAmount)) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 },
      );
    }

    const MAX_DESCRIPTION_LENGTH = 127;
    const productNames = order.products
      .map(
        (p) => p.name?.replace(/[^\w\s\-.,]/g, "").trim() || "Unnamed product",
      )
      .slice(0, 5)
      .join(", ");

    let description = `Order #${orderId.slice(0, 8)}: ${productNames}`;
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      description =
        description.substring(0, MAX_DESCRIPTION_LENGTH - 3) + "...";
    }

    const paypalOrder = await createPayPalOrder(
      order.id,
      order.totalAmount.toString(),
      description,
    );

    const approveLink = paypalOrder.links.find(
      (link: any) => link.rel === "approve",
    );

    if (!approveLink) {
      throw new Error("Approve link not found in PayPal response");
    }

    return NextResponse.json({
      success: true,
      paypalOrderId: paypalOrder.id,
      approvalUrl: approveLink.href,
    });
  } catch (error: any) {
    console.error("Error creating PayPal payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 },
    );
  }
}
