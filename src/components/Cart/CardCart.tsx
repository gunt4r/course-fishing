'use client';
import { Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { useDeleteItemFromCart } from '@/app/queries/cart/cartQuery';
import MyLink from '../Link';

type CardCartProps = {
  cartItem: {
    id: string;
    image: string;
    name: string;
    price: string;
  };
};
export default function CardCart({ cartItem }: CardCartProps) {
  const { mutate: deleteItem } = useDeleteItemFromCart();

  const handleDelete = () => {
    deleteItem(cartItem.id, {
      onSuccess: () => {
        toast.success('Item removed from cart');
      },
      onError: () => {
        toast.error('Failed to remove item from cart');
      },
    });
  };
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4">
      <div className="flex items-center">
        <button onClick={() => handleDelete()} className="">
          {' '}
          <Icon
            icon="streamline:delete-1-solid"
            className="mr-4 cursor-pointer text-zinc-600 transition-colors duration-300 hover:text-red-500"
          />
        </button>
        <MyLink href={`/products/${cartItem.id}`}>
          <Image
            src={cartItem.image}
            alt={cartItem.name}
            className="mr-4 h-16 rounded object-cover"
          />
        </MyLink>
        <div>
          <MyLink href={`/products/${cartItem.id}`}><h3 className="text-lg font-medium">{cartItem.name}</h3></MyLink>
        </div>
      </div>
      <MyLink href={`/products/${cartItem.id}`}>
        <p className="text-lg font-semibold">
          {cartItem.price}
          {' '}
          €
        </p>
      </MyLink>
    </div>
  );
}
