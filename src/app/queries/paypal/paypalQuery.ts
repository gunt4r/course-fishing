import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/api/axios';
import { REACT_QUERY_GET_PAYPAL_KEY } from '@/config/const';

export function useCreatePaypalOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.post('/api/paypal/create', data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_PAYPAL_KEY] });
    },
  });
}
