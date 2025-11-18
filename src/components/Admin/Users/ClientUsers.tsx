'use client';
import type { User } from '@/types/user';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  getUsers,
  useDeleteUser,
  useRegisterUser,
  useUpdateUser,
} from '@/app/queries/users/userQuery';
import Loader from '@/components/Loader';
import ModalDelete from '@/components/Modals/ModalDelete';
import ModalAddUser from '@/components/Modals/User/ModalAdd';
import ModalEditUser from '@/components/Modals/User/ModalEdit';
import TableAdmin from '@/components/Table';
import getDefaultActions from '@/utils/Helpers';

export default function ClientUsers() {
  const { data: users, isLoading } = getUsers();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutateAsync: registerUser, isPending: isAdding } = useRegisterUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const t = useTranslations('Header');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const actionsUsers = getDefaultActions({
    handleEdit: (user: User) => {
      setSelectedUser(user);
      setIsModalEditOpen(true);
    },
    handleDelete: (user: User) => {
      setSelectedUser(user);
      setIsModalDeleteOpen(true);
    },
  });

  async function handleDeleteUser() {
    try {
      await deleteUser(selectedUser?.id as string);
      setIsModalDeleteOpen(false);
      setSelectedUser(null);
      toast.success(t('deleted') ?? 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred');
    }
  }

  async function handleAddUser(data: User) {
    try {
      await registerUser(data);
      setIsModalAddOpen(false);
      toast.success(t('saved') ?? 'User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('An error occurred');
    }
  }

  async function handleEditUser(data: User) {
    try {
      await updateUser(data);
      setIsModalEditOpen(false);
      setSelectedUser(null);
      toast.success(t('saved') ?? 'User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An error occurred');
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <TableAdmin
        list={users}
        actions={actionsUsers}
        titleTable="USERS"
        onAddItem={() => setIsModalAddOpen(true)}
        ommitedAttributes={['password']}
      />

      <ModalDelete
        isModalOpen={isModalDeleteOpen}
        handleSubmit={handleDeleteUser}
        isLoading={isDeleting}
        setIsModalOpen={setIsModalDeleteOpen}
        title={t('delete') ?? 'Delete User'}
      />

      <ModalAddUser
        isModalOpen={isModalAddOpen}
        setIsModalOpen={setIsModalAddOpen}
        handleSubmit={handleAddUser}
        isLoading={isAdding}
      />

      <ModalEditUser
        isModalOpen={isModalEditOpen}
        setIsModalOpen={setIsModalEditOpen}
        handleSubmit={handleEditUser}
        isLoading={isUpdating}
        user={selectedUser}
      />
    </div>
  );
}
