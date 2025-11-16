import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { getOrderById } = await import('@/services/order/service');
  const { createPayPalOrder } = await import('@/services/paypal/service');
  const { sendOrderConfirmationEmail } = await import(
    '@/services/mail/service',
  );
  const { getDataSource } = await import('@/libs/DB');
  const { Order } = await import('@/models/order');
  try {
    const body = await request.json();
    const { orderId, locale = 'en' } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 },
      );
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Order is not in pending status' },
        { status: 400 },
      );
    }

    const productNames = order.products.map(p => p.name).join(', ');
    const description = `Order #${order.id.slice(0, 8)}: ${productNames}`;

    const paypalOrder = await createPayPalOrder(
      order.id,
      order.totalAmount.toString(),
      description,
    );

    const approveLink = paypalOrder.links.find(
      (link: any) => link.rel === 'approve',
    );

    if (!approveLink) {
      throw new Error('Approve link not found in PayPal response');
    }

    const dataSource = await getDataSource();
    const orderRepo = dataSource.getRepository(Order);
    if (order) {
      order.paypalOrderId = paypalOrder.id;
      await orderRepo.save(order);
      await sendOrderConfirmationEmail(order, locale);
    }
    return NextResponse.json({
      success: true,
      paypalOrderId: paypalOrder.id,
      approvalUrl: approveLink.href,
    });
  } catch (error: any) {
    console.error('Error creating PayPal payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 },
    );
  }
}
