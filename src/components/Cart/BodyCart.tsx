'use client';
import CardCart from './CardCart';

export default function BodyCart({ cartItems }: { cartItems: any }) {
  console.log(cartItems);
  return (
    <div className="sm:w-3/4 w-full flex flex-col">
      {cartItems.map((cartItem: any) => (
        <CardCart key={cartItem.id} cartItem={cartItem.product} />
      ))}
    </div>
  );
}
