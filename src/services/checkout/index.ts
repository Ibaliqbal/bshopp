import instance from "@/lib/axios/instance";

export const checkoutService = {
  pay: (data: any) => instance.post(`/api/checkout`, data),
};
