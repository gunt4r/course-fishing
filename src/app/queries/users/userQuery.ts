import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  REACT_QUERY_GET_USER_KEY,
  REACT_QUERY_GET_USERS_KEY,
  REACT_QUERY_GET_ME_KEY,
} from "@/config/const";
import type { User } from "@/types/user";
import { api } from "@/app/api/axios";

export function useCurrentUser() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_ME_KEY],
    queryFn: async (): Promise<User> => {
      try {
        const response = await api.get(`/api/users/me`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
    staleTime: 60 * 60 * 1000,
  });
}
export function getUser(id: string) {
  return useQuery({
    queryKey: [REACT_QUERY_GET_USER_KEY],
    queryFn: async (): Promise<User> => {
      try {
        const response = await api.get(`/api/users/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function getUsers() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_USERS_KEY],
    queryFn: async () => {
      try {
        const response = await api.get("/api/users");

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useRegisterUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      try {
        const response = await api.post("/api/users/register", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_USERS_KEY] });
    },
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      try {
        const response = await api.post("/api/users/login", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_USERS_KEY] });
    },
  });
}

export function useLogoutUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await api.post(`/api/users/logout`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_ME_KEY] });
    },
  });
}
