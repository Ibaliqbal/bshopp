import instance from "@/lib/axios/instance";
import { TStatus } from "./service";
import { TPay } from "@/types/checkout";

export const checkoutService = {
  pay: (data: TPay) => instance.post(`/api/checkout`, data),
  get: (id: string) => instance.get(`/api/checkout?user_id=${id}`),
  delete: (id: string) => instance.delete(`/api/checkout/${id}`),
  detail: (id: string) => instance.get(`/api/checkout/${id}`),
  filter: (id: string, filter: TStatus) =>
    instance.get(`/api/checkout?status=${filter}&user_id=${id}`),
  updateStatus: (id: string, data: { status: string }) =>
    instance.patch(`/api/checkout/${id}`, data),
  update: <TData>(id: string, data: TData) =>
    instance.put(`/api/checkout/${id}`, data),
};
