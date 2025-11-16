import type { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/api/axios';
import {
  REACT_QUERY_GET_ME_KEY,
  REACT_QUERY_GET_USER_KEY,
  REACT_QUERY_GET_USERS_KEY,
} from '@/config/const';

export function useCurrentUser() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_ME_KEY],
    queryFn: async (): Promise<any> => {
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
        const response = await api.get('/api/users');

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
        const response = await api.post('/api/users/register', data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_USERS_KEY] });
    },
    retry: false,
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      try {
        const response = await api.post('/api/users/login', data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_USERS_KEY] });
      queryClient.setQueryData([REACT_QUERY_GET_ME_KEY], data);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      try {
        const response = await api.patch('/api/users', data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData([REACT_QUERY_GET_ME_KEY], data);
    },
  });
}
export function useUpdateUserServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      try {
        const response = await api.patch('/api/users', data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REACT_QUERY_GET_USERS_KEY] });
    },
    retry: false,
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
      queryClient.setQueryData([REACT_QUERY_GET_ME_KEY], null);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/api/users/${id}`);
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
