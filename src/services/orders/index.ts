import instance from "@/lib/axios/instance";
import { TCreate } from "@/types/orders";

export const ordersService = {
  update: (id: string, data: any) => instance.put(`/api/order/${id}`, data),
  delete: (id: string) => instance.delete(`/api/order/${id}`),
  create: (data: TCreate) => instance.post("/api/order", data),
  get: () => instance.get("/api/order"),
  detail: (id: string) => instance.get(`/api/order/${id}`),
  updateStatus: (id: string, data: { status: string }) =>
    instance.patch(`/api/order/${id}`, data),
};
