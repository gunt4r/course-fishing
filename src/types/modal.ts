import type { ProductProps } from './product';
import type { User } from './user';
import type { Order } from '@/models/order';
import type { Product } from '@/models/product';

export type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  isLoading: boolean;
  refetch?: () => void;
};
export type ModalEditUserProps = {
  handleSubmit: (data: User) => void;
  user: User | null;
} & ModalProps;

export type ModalAddUserProps = {
  handleSubmit: (data: User) => void;
} & ModalProps;

export type ModalAddOrderProps = {
  handleSubmit: (data: Order) => void;
  users: User[] | null;
  products: Product[] | null;
} & ModalProps;

export type ModalEditOrderProps = {
  handleSubmit: (data: Order) => void;
  order: Order | null;
  users: User[] | null;
  products: Product[] | null;
} & ModalProps;

export type ModalAddProductProps = {
  handleSubmit: (data: any) => void;
  template?: any;
  fields?: Array<{
    key: keyof ProductProps;
    label?: string;
    type?: string;
    required?: boolean;
  }>;
} & ModalProps;
export type ModalEditProductProps = {
  handleSubmit: (data: any) => void;
  product: ProductProps | null;
} & ModalProps;

export type ModalAddArticleProps = {
  handleSubmit: (data: any) => Promise<void>;
} & ModalProps;

export type ModalEditArticleProps = {
  article: any | null;
  handleSubmit: (data: any) => Promise<void>;
} & ModalProps;
