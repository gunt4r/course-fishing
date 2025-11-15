"use client";
import TableAdmin from "@/components/Table";
import type { Order } from "@/models/order";
import getDefaultActions from "@/utils/Helpers";
import { useState } from "react";
import ModalDelete from "@/components/Modals/ModalDelete";
import ModalAddOrder from "@/components/Modals/Orders/ModalAdd";
import ModalEditOrder from "@/components/Modals/Orders/ModalEdit";
import {
  useDeleteOrder,
  getOrders,
  useUpdateOrder,
  useCreateOrderServer,
} from "@/app/queries/orders/ordersQuery";
import { getUsers } from "@/app/queries/users/userQuery";
import { useProducts } from "@/app/queries/product/productQuery";
import { useTranslations } from "next-intl";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function ClientOrders() {
  const { data: orders, isLoading: ordersLoading, refetch } = getOrders();
  const { data: users, isLoading: usersLoading } = getUsers();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const { mutateAsync: createOrder, isPending: isAdding } =
    useCreateOrderServer();
  const { mutateAsync: updateOrder, isPending: isUpdating } = useUpdateOrder();
  const t = useTranslations("Dashboard");

  console.log(products);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const actionsOrders = getDefaultActions({
    handleEdit: (order: Order) => {
      setSelectedOrder(order);
      setIsModalEditOpen(true);
    },
    handleDelete: (order: Order) => {
      setSelectedOrder(order);
      setIsModalDeleteOpen(true);
    },
  });

  async function handleDeleteOrder() {
    try {
      await deleteOrder(selectedOrder?.id as string);
      setIsModalDeleteOpen(false);
      setSelectedOrder(null);
      toast.success(t("deleted") ?? "Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(t("error") ?? "An error occurred");
    }
  }

  async function handleAddOrder(data: any) {
    try {
      await createOrder(data);
      setIsModalAddOpen(false);
      toast.success(t("added") ?? "Order added successfully");
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error(t("error") ?? "An error occurred");
    }
  }

  async function handleEditOrder(data: any) {
    try {
      await updateOrder(data);
      setIsModalEditOpen(false);
      setSelectedOrder(null);
      toast.success(t("updated") ?? "Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(t("error") ?? "An error occurred");
    }
  }

  if (ordersLoading || usersLoading || productsLoading) return <Loader />;

  return (
    <div className="w-full">
      <TableAdmin
        list={orders}
        actions={actionsOrders}
        titleTable="ORDERS"
        onAddItem={() => setIsModalAddOpen(true)}
      />

      <ModalDelete
        isModalOpen={isModalDeleteOpen}
        handleSubmit={handleDeleteOrder}
        isLoading={isDeleting}
        setIsModalOpen={setIsModalDeleteOpen}
        title={t("delete") ?? "Delete Order"}
      />

      <ModalAddOrder
        isModalOpen={isModalAddOpen}
        setIsModalOpen={setIsModalAddOpen}
        handleSubmit={handleAddOrder}
        isLoading={isAdding}
        users={users}
        products={products.products}
        refetch={refetch}
      />

      <ModalEditOrder
        isModalOpen={isModalEditOpen}
        setIsModalOpen={setIsModalEditOpen}
        handleSubmit={handleEditOrder}
        isLoading={isUpdating}
        order={selectedOrder}
        users={users}
        products={products.products}
        refetch={refetch}
      />
    </div>
  );
}
