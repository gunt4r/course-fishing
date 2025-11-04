import { useQuery } from "@tanstack/react-query";
import {
  REACT_QUERY_GET_PRODUCTS_KEY,
  REACT_QUERY_GET_PRODUCT_KEY,
} from "@/config/const";
import { api } from "@/app/api/axios";
import { ProductProps } from "@/types/product";
export function useProducts() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_PRODUCTS_KEY],
    queryFn: async () => {
      try {
        console.log(api);
        const response = await api("/api/products");

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [REACT_QUERY_GET_PRODUCT_KEY, id],
    queryFn: async () => {
      try {
        const response = await api(`/api/products/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000,
  });
}
