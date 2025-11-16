import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/api/axios';
import {
  REACT_QUERY_GET_PRODUCT_KEY,
  REACT_QUERY_GET_PRODUCTS_KEY,
} from '@/config/const';

export function useProducts() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_PRODUCTS_KEY],
    queryFn: async () => {
      try {
        console.log(api);
        const response = await api.get('/api/products');

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [REACT_QUERY_GET_PRODUCT_KEY, id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.post('/api/products', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REACT_QUERY_GET_PRODUCTS_KEY] });
    },
  });
}
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.patch(`/api/products/${data.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REACT_QUERY_GET_PRODUCTS_KEY] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/api/products/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REACT_QUERY_GET_PRODUCTS_KEY] });
    },
  });
}
