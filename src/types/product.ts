export interface CardProductProps {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface ProductProps extends CardProductProps {
  description: string;
  html: string;
  sanitizedHtml: string;
}
