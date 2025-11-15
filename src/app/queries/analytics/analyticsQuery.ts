import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_GET_ANALYTICS_KEY } from "@/config/const";
import { api } from "@/app/api/axios";
export function useAnalytics() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_ANALYTICS_KEY],
    queryFn: async () => {
      try {
        const response = await api.get("/api/analytics");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}
