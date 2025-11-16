import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/api/axios';
import { REACT_QUERY_GET_CART_KEY } from '@/config/const';

export function useCart() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_CART_KEY],
    queryFn: async () => {
      try {
        const response = await api.get('/api/cart');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        const response = await api.post(
          '/api/cart',
          JSON.stringify({ productId }),
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_CART_KEY] });
    },
  });
}

export function useDeleteItemFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        const response = await api.delete('/api/cart', {
          data: { productId },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_CART_KEY] });
    },
  });
}
