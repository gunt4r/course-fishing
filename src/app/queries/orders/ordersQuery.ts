import type { Order } from '@/models/order';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/api/axios';
import { REACT_QUERY_GET_ORDERS_KEY } from '@/config/const';

export function getOrders() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_ORDERS_KEY],
    queryFn: async () => {
      try {
        const response = await api.get('/api/order');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}
export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.post('/api/order', data);

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}
export function useCreateOrderServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.post('/api/order/server', data);

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REACT_QUERY_GET_ORDERS_KEY] });
    },
  });
}
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Order) => {
      try {
        const response = await api.patch(`/api/order/${data.id}`, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_ORDERS_KEY] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/api/order/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_ORDERS_KEY] });
    },
  });
}
