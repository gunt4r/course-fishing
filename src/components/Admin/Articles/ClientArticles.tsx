'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useCreateArticle,
  useDeleteArticle,
  useGetArticles,
  useUpdateArticle,
} from '@/app/queries/articles/articlesQuery';
import Loader from '@/components/Loader';
import ModalAddArticle from '@/components/Modals/Articles/ModalAdd';
import ModalEditArticle from '@/components/Modals/Articles/ModalEdit';
import ModalDelete from '@/components/Modals/ModalDelete';
import TableAdmin from '@/components/Table';
import getDefaultActions from '@/utils/Helpers';

export default function ClientArticles() {
  const t = useTranslations('Header');
  const tDashboard = useTranslations('Dashboard');
  const { data: articles, isLoading, refetch } = useGetArticles();

  const { mutateAsync: createArticle, isPending: isCreating }
    = useCreateArticle();
  const { mutateAsync: updateArticle, isPending: isUpdating }
    = useUpdateArticle();
  const { mutateAsync: deleteArticle, isPending: isDeleting }
    = useDeleteArticle();

  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const actionsArticles = getDefaultActions({
    handleEdit: (article: any) => {
      setSelectedArticle(article);
      setIsModalEditOpen(true);
    },
    handleDelete: (article: any) => {
      setSelectedArticle(article);
      setIsModalDeleteOpen(true);
    },
  });

  async function handleDelete() {
    try {
      await deleteArticle(selectedArticle?.id as string);
      setIsModalDeleteOpen(false);
      setSelectedArticle(null);
      toast.success(t('deleted') ?? 'Article deleted');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  }

  async function handleAdd(data: any) {
    try {
      await createArticle(data);
      setIsModalAddOpen(false);
      toast.success(t('saved') ?? 'Article added');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  }

  async function handleEdit(data: any) {
    try {
      await updateArticle(data);
      setIsModalEditOpen(false);
      setSelectedArticle(null);
      toast.success(t('saved') ?? 'Article updated');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  }

  if (isLoading) {
    return <Loader />;
  }
  console.log(articles);
  return (
    <div className="w-full">
      <TableAdmin
        list={articles || []}
        actions={actionsArticles}
        titleTable="Articles"
        onAddItem={() => setIsModalAddOpen(true)}
      />

      <ModalDelete
        isModalOpen={isModalDeleteOpen}
        handleSubmit={handleDelete}
        isLoading={isDeleting}
        setIsModalOpen={setIsModalDeleteOpen}
        title={tDashboard('delete') ?? 'Delete Article'}
      />

      <ModalAddArticle
        isModalOpen={isModalAddOpen}
        setIsModalOpen={setIsModalAddOpen}
        handleSubmit={handleAdd}
        isLoading={isCreating}
        refetch={refetch}
      />

      <ModalEditArticle
        isModalOpen={isModalEditOpen}
        setIsModalOpen={setIsModalEditOpen}
        handleSubmit={handleEdit}
        isLoading={isUpdating}
        article={selectedArticle}
        refetch={refetch}
      />
    </div>
  );
}
