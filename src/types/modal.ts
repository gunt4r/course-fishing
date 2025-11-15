import { Order } from "@/models/order";
import { User } from "./user";
import { Product } from "@/models/product";
import { ProductProps } from "./product";

export interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  isLoading: boolean;
  refetch?: () => void;
}
export interface ModalEditUserProps extends ModalProps {
  handleSubmit: (data: User) => void;
  user: User | null;
}

export interface ModalAddUserProps extends ModalProps {
  handleSubmit: (data: User) => void;
}

export interface ModalAddOrderProps extends ModalProps {
  handleSubmit: (data: Order) => void;
  users: User[] | null;
  products: Product[] | null;
}

export interface ModalEditOrderProps extends ModalProps {
  handleSubmit: (data: Order) => void;
  order: Order | null;
  users: User[] | null;
  products: Product[] | null;
}

export interface ModalAddProductProps extends ModalProps {
  handleSubmit: (data: any) => void;
  template?: any;
  fields?: Array<{
    key: keyof ProductProps;
    label?: string;
    type?: string;
    required?: boolean;
  }>;
}
export interface ModalEditProductProps extends ModalProps {
  handleSubmit: (data: any) => void;
  product: ProductProps | null;
}

export interface ModalAddArticleProps extends ModalProps {
  handleSubmit: (data: any) => Promise<void>;
}

export interface ModalEditArticleProps extends ModalProps {
  article: any | null;
  handleSubmit: (data: any) => Promise<void>;
}
