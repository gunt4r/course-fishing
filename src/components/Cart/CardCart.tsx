"use client";
import { Icon } from "@iconify/react";
import { useDeleteItemFromCart } from "@/app/queries/cart/cartQuery";
import toast from "react-hot-toast";
interface CardCartProps {
  cartItem: {
    id: string;
    image: string;
    name: string;
    price: string;
  };
}
export default function CardCart({ cartItem }: CardCartProps) {
  const { mutate: deleteItem } = useDeleteItemFromCart();

  const handleDelete = () => {
    deleteItem(cartItem.id, {
      onSuccess: () => {
        toast.success("Item removed from cart");
      },
      onError: () => {
        toast.error("Failed to remove item from cart");
      },
    });
  };
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <button onClick={() => handleDelete()} className="">
          {" "}
          <Icon
            icon="streamline:delete-1-solid"
            className="text-zinc-600 duration-300 transition-colors hover:text-red-500 mr-4 cursor-pointer"
          />
        </button>
        <img
          src={cartItem.image}
          alt={cartItem.name}
          className="w-16 h-16 object-cover rounded mr-4"
        />
        <div>
          <h3 className="text-lg font-medium">{cartItem.name}</h3>
        </div>
      </div>
      <div className="text-lg font-semibold">{cartItem.price} €</div>
    </div>
  );
}
