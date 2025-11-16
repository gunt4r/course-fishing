'use client';
import type { ProductProps } from '@/types/product';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '@/app/queries/product/productQuery';
import Loader from '@/components/Loader';
import ModalDelete from '@/components/Modals/ModalDelete';
import ModalAddProduct from '@/components/Modals/Product/ModalAdd';

import ModalEditProduct from '@/components/Modals/Product/ModalEdit';
import TableAdmin from '@/components/Table';

import getDefaultActions from '@/utils/Helpers';

export default function ClientProducts() {
  const t = useTranslations('Header');
  const { data: products, isLoading, refetch } = useProducts();

  const { mutateAsync: createProduct, isPending: isCreating }
    = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating }
    = useUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: isDeleting }
    = useDeleteProduct();

  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(
    null,
  );
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const actionsProducts = getDefaultActions({
    handleEdit: (p: ProductProps) => {
      setSelectedProduct(p);
      setIsModalEditOpen(true);
    },
    handleDelete: (p: ProductProps) => {
      setSelectedProduct(p);
      setIsModalDeleteOpen(true);
    },
  });

  async function handleDelete() {
    try {
      await deleteProduct(selectedProduct?.id as string);
      setIsModalDeleteOpen(false);
      setSelectedProduct(null);
      toast.success(t('deleted') ?? 'Product deleted');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  }

  async function handleAdd(data: Partial<ProductProps>) {
    try {
      await createProduct(data);
      setIsModalAddOpen(false);
      toast.success(t('saved') ?? 'Product added');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  }

  async function handleEdit(data: Partial<ProductProps>) {
    try {
      await updateProduct(data);
      setIsModalEditOpen(false);
      setSelectedProduct(null);
      toast.success(t('saved') ?? 'Product updated');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <TableAdmin
        list={products.products}
        actions={actionsProducts}
        titleTable="PRODUCTS"
        onAddItem={() => setIsModalAddOpen(true)}
      />

      <ModalDelete
        isModalOpen={isModalDeleteOpen}
        handleSubmit={handleDelete}
        isLoading={isDeleting}
        setIsModalOpen={setIsModalDeleteOpen}
        title={t('delete') ?? 'Delete Product'}
      />

      <ModalAddProduct
        isModalOpen={isModalAddOpen}
        setIsModalOpen={setIsModalAddOpen}
        handleSubmit={handleAdd}
        isLoading={isCreating}
        refetch={refetch}
      />

      <ModalEditProduct
        isModalOpen={isModalEditOpen}
        setIsModalOpen={setIsModalEditOpen}
        handleSubmit={handleEdit}
        isLoading={isUpdating}
        product={selectedProduct}
        refetch={refetch}
      />
    </div>
  );
}
