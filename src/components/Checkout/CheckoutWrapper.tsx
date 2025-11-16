'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClientCheckout from '@/components/Checkout/ClientCheckout';

export default function CheckoutWrapper() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        const data = await response.json();

        if (data.success && data.cart) {
          if (data.cart.items.length === 0) {
            router.push('/cart');
            return;
          }
          setCart(data.cart);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  return <ClientCheckout cart={cart} />;
}
