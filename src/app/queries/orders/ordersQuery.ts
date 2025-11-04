import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/axios";


export function useCreateOrder() {
  return useMutation({
    mutationKey: ["create-order"],
    mutationFn: async (data: any) => {
      try {
        const response = await api.post("/api/order", data);

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}