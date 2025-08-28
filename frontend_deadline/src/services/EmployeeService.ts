import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api-client-ad";
import type { MutationConfig } from "../lib/react-query";

import { CreateEmployee, Employee, Paging, UpdateEmployee } from "../type/type";
type Params = {
  page: number;
  size: number;
};

export const getAllEmployees = ({ page, size }: Params): Promise<Paging<Employee>> => {
  return apiClient.get(`/employees`, {
    params: {
      page,
      size
    }
  });
};

export const getPaginatedEmployeesQueryOptions = ({ page, size }: Params) => {
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
    onSuccess: (data, variables, ...args) => {
      // Cập nhật cache trực tiếp, không fetch lại
      // Lấy tất cả các cache page/size hiện có và cập nhật từng cái
      const queryCache = queryClient.getQueryCache().findAll({ queryKey: ['getPaginatedEmployees'] });
      queryCache.forEach(({ queryKey }) => {
        queryClient.setQueryData<Paging<Employee> | undefined>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data?.map((emp) =>
                emp.id === variables.id
                  ? {
                      ...emp,
                      ...variables.data 
                    }
                  : emp
              )
            };
          }
        );
      });
      onSuccess?.(data, variables, ...args);
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
    onSuccess: (data, id, ...args) => {
      const queryCache = queryClient.getQueryCache().findAll({ queryKey: ['getPaginatedEmployees'] });
      queryCache.forEach(({ queryKey }) => {
        queryClient.setQueryData<Paging<Employee> | undefined>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data?.filter((emp) => emp.id !== id)
            };
          }
        );
      });
      onSuccess?.(data, id, ...args);
    },
    ...restConfig,
    mutationFn: deleteEmployee, 
  });
};