import instance from "@/lib/axios/instance";

export const ordersService = {
  update: (id: string, data: any) => instance.put(`/api/order/${id}`, data),
  delete: (id: string) => instance.delete(`/api/order/${id}`),
};
