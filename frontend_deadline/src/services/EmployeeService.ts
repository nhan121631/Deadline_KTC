import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api-client-ad";
import type { MutationConfig } from "../lib/react-query";

import { CreateEmployee, Employee, Paging, UpdateEmployee } from "../type/type";

export const getAllEmployees = ({ page, size }: { page: number; size: number }): Promise<Paging<Employee>> => {
  return apiClient.get(`/employees`, {
    params: {
      page,
      size
    }
  });
};

  export const getPaginatedEmployeesQueryOptions = (page: number, size: number) => {
  return queryOptions({
    queryKey: ['getPaginatedEmployees', page, size] as const,
    queryFn: () => getAllEmployees({ page, size }),
  });
};

//====update employee====//

const updateEmployee = async ({ id, data }: { id: number; data: UpdateEmployee }) => {
  return apiClient.put(`/employees/${id}`, data);
};

type UseUpdateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof updateEmployee>;
};
export const useUpdateEmployee = ({ mutationConfig }: UseUpdateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['getPaginatedEmployees']
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateEmployee,
  });
};

//==== add employee====//
const addEmployee = async (data: CreateEmployee) => {
  return apiClient.post(`/employees`, data);
};

type UseAddEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof addEmployee>;
};
export const useAddEmployee = ({ mutationConfig }: UseAddEmployeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['getPaginatedEmployees']
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: addEmployee,
  });
};

//===delete employee==//
const deleteEmployee = async (id: number) => {
  return apiClient.delete(`/employees/${id}`);
};

type UseDeleteEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof deleteEmployee>;
};
export const useDeleteEmployee = ({ mutationConfig }: UseDeleteEmployeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['getPaginatedEmployees']
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: deleteEmployee,
  });
};