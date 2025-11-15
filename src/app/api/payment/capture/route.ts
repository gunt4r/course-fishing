import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/services/paypal/service";
import { getOrderById, updateOrder } from "@/services/order/service";
import { orderStatus } from "@/config/enum";
import { sendOrderConfirmationEmail } from "@/services/mail/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paypalOrderId, orderId, locale = "en" } = body;

    if (!paypalOrderId || !orderId) {
      return NextResponse.json(
        { error: "PayPal Order ID and Order ID are required" },
        { status: 400 },
      );
    }

    // Получаем наш заказ из БД
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Захватываем платеж в PayPal
    const captureData = await capturePayPalOrder(paypalOrderId);

    // Проверяем статус платежа
    if (captureData.status === "COMPLETED") {
      // Обновляем статус заказа в БД
      await updateOrder(order.id, {
        status: orderStatus.completed,
      });

      // Отправляем email с подтверждением и PDF файлами
      try {
        await sendOrderConfirmationEmail(order, locale);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Не возвращаем ошибку, т.к. платеж уже прошел
      }

      return NextResponse.json({
        success: true,
        message: "Payment captured successfully",
        order: {
          id: order.id,
          status: orderStatus.completed,
          totalAmount: order.totalAmount,
        },
      });
    } else {
      // Платеж не завершен
      await updateOrder(order.id, {
        status: orderStatus.failed,
      });

      return NextResponse.json(
        {
          error: "Payment was not completed",
          status: captureData.status,
        },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Error capturing PayPal payment:", error);

    // Обновляем статус заказа на failed
    try {
      const { orderId } = await request.json();
      if (orderId) {
        await updateOrder(orderId, {
          status: orderStatus.failed,
        });
      }
    } catch (updateError) {
      console.error("Failed to update order status:", updateError);
    }

    return NextResponse.json(
      { error: error.message || "Failed to capture payment" },
      { status: 500 },
    );
  }
}
