import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { orderStatus } from '@/config/enum';

export async function POST(request: NextRequest) {
  const { getOrderById, updateOrder } = await import(
    '@/services/order/service',
  );
  const { capturePayPalOrder, getPayPalOrderDetails } = await import(
    '@/services/paypal/service',
  );
  const { sendOrderConfirmationEmail } = await import(
    '@/services/mail/service',
  );
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Invalid JSON payload:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 },
      );
    }

    const { paypalOrderId, orderId, locale = 'en' } = body;

    if (!paypalOrderId || typeof paypalOrderId !== 'string' || paypalOrderId.trim().length < 10) {
      return NextResponse.json(
        { error: 'Invalid PayPal Order ID format' },
        { status: 400 },
      );
    }

    if (!orderId || typeof orderId !== 'string' || orderId.length < 10) {
      return NextResponse.json(
        { error: 'Invalid Order ID format' },
        { status: 400 },
      );
    }

    const supportedLocales = ['en', 'ru', 'ro'];
    if (!supportedLocales.includes(locale.toLowerCase())) {
      return NextResponse.json(
        { error: `Unsupported locale. Supported: ${supportedLocales.join(', ')}` },
        { status: 400 },
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 },
      );
    }

    if (order.status !== 'awaiting_payment') {
      return NextResponse.json(
        {
          error: `Order is in "${order.status}" status. Only "awaiting_payment" orders can be captured.`,
        },
        { status: 400 },
      );
    }

    if (order.paypalOrderId && order.paypalOrderId !== paypalOrderId) {
      console.error(`PayPal Order ID mismatch for order ${orderId}. Stored: ${order.paypalOrderId}, Received: ${paypalOrderId}`);
      return NextResponse.json(
        {
          error: 'PayPal Order ID mismatch. This order is associated with a different PayPal transaction.',
        },
        { status: 400 },
      );
    }

    let paypalOrderDetails;
    try {
      paypalOrderDetails = await getPayPalOrderDetails(paypalOrderId);

      const paypalAmount = Number.parseFloat(paypalOrderDetails.purchase_units[0].amount.value);
      if (Math.abs(paypalAmount - order.totalAmount) > 0.01) {
        console.error(`Amount mismatch for order ${orderId}. Expected: ${order.totalAmount}, Received: ${paypalAmount}`);
        return NextResponse.json(
          {
            error: `Payment amount mismatch. Expected: $${order.totalAmount.toFixed(2)}, Received: $${paypalAmount.toFixed(2)}`,
          },
          { status: 400 },
        );
      }

      if (paypalOrderDetails.status !== 'APPROVED') {
        console.error(`Invalid PayPal order status: ${paypalOrderDetails.status} for order ${orderId}`);
        return NextResponse.json(
          {
            error: `PayPal order must be in "APPROVED" status. Current status: ${paypalOrderDetails.status}`,
          },
          { status: 400 },
        );
      }
    } catch (paypalError) {
      console.error('Failed to get PayPal order details:', paypalError);
      throw new Error(`Failed to verify PayPal order: ${paypalError instanceof Error ? paypalError.message : 'Unknown error'}`);
    }

    const captureData = await Promise.race([
      capturePayPalOrder(paypalOrderId),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('PayPal capture timeout after 15 seconds')), 15000),
      ),
    ]);

    if (!captureData || captureData.status !== 'COMPLETED') {
      await updateOrder(order.id, {
        status: orderStatus.failed,
        failureReason: captureData
          ? `PayPal capture failed with status: ${captureData.status}`
          : 'No response from PayPal',
      });

      console.error(`Payment capture failed for order ${orderId}. Status: ${captureData?.status || 'NO_RESPONSE'}`);

      return NextResponse.json(
        {
          error: 'Payment capture failed',
          status: captureData?.status || 'NO_RESPONSE',
          details: captureData?.status === 'DECLINED'
            ? 'Your payment was declined by the bank. Please try another payment method.'
            : captureData?.status === 'PARTIALLY_COMPLETED'
              ? 'Partial payment received. Contact support for resolution.'
              : undefined,
        },
        { status: 402 },
      );
    }

    const updatedOrder = await updateOrder(order.id, {
      status: orderStatus.completed,
      paypalCaptureId: captureData.id,
      capturedAt: new Date(),
      paymentDetails: {
        paypalOrderId,
        captureId: captureData.id,
        amount: order.totalAmount,
        currency: 'USD',
        paymentMethod: 'paypal',
      },
    });

    console.log(`Payment captured successfully for order ${orderId}. Capture ID: ${captureData.id}`);

    setImmediate(async () => {
      try {
        await sendOrderConfirmationEmail(updatedOrder, locale.toLowerCase());
      } catch (emailError) {
        console.error(`Failed to send confirmation email for order ${orderId}:`, emailError);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment captured successfully',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        totalAmount: updatedOrder.totalAmount,
        captureId: captureData.id,
      },
    });
  } catch (error: any) {
    console.error('Critical error in PayPal capture:', error);

    try {
      const { orderId } = await request.json();
      if (orderId) {
        await updateOrder(orderId, {
          status: orderStatus.failed,
          failureReason: `Critical error during capture: ${error.message || 'Unknown error'}`,
        });
      }
    } catch (updateError) {
      console.error('Failed to update order status after critical error:', updateError);
    }

    let status = 500;
    const errorMessage = error.message || 'Failed to capture payment';

    if (errorMessage.includes('timeout')) {
      status = 504;
    } else if (errorMessage.includes('Invalid') || errorMessage.includes('mismatch')) {
      status = 400;
    } else if (errorMessage.includes('not found')) {
      status = 404;
    }

    return NextResponse.json(
      {
        error: status < 500
          ? errorMessage
          : 'Payment processing failed. Our team has been notified.',
      },
      { status },
    );
  }
}
