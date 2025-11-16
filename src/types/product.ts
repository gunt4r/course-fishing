export type CardProductProps = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export type ProductProps = {
  description: string;
  html: string;
  sanitizedHtml: string;
  isActive: boolean;
  document: string;
} & CardProductProps;
