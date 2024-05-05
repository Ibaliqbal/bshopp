import instance from "@/lib/axios/instance";
import { TStatus } from "./service";

export const checkoutService = {
  pay: (data: any) => instance.post(`/api/checkout`, data),
  get: (id: string) => instance.get(`/api/checkout/${id}`),
  filter: (id: string, filter: TStatus) =>
    instance.get(`/api/checkout/${id}?status=${filter}`),
  update: (id: string, data: any) => instance.put(`/api/checkout/${id}`, data),
};
