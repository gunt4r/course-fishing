import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/axios";
import {
  REACT_QUERY_GET_ARTICLES_KEY,
  REACT_QUERY_GET_ARTICLE_KEY,
} from "@/config/const";
export function useGetArticles() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_ARTICLES_KEY],
    queryFn: async () => {
      try {
        const response = await api.get("/api/articles");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useGetArticle(id: string) {
  return useQuery({
    queryKey: [REACT_QUERY_GET_ARTICLE_KEY, id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/articles/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useGetArticlesByType(type: string) {
  return useQuery({
    queryKey: [REACT_QUERY_GET_ARTICLES_KEY, type],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/articles/type/${type}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.post("/api/articles", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_GET_ARTICLES_KEY],
      });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/api/articles/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_GET_ARTICLES_KEY],
      });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.patch(`/api/articles/${data.id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_GET_ARTICLES_KEY],
      });
    },
  });
}
