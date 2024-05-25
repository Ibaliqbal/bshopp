import instance from "@/lib/axios/instance";

const userService = {
  get: () => instance.get(`/api/user`),
  delete: (id: string) => instance.delete(`/api/user/${id}`),
  detailUserByEmail: (email: string) =>
    instance.get(`/api/user?_email=${email}`),
  update: (id: string, data: any) => instance.put(`/api/user/${id}`, data),
  detail: (id: string) => instance.get(`/api/user/${id}`),
  reset: (id: string, data: any) => instance.put(`/api/user/${id}/reset`, data),
  byEmail: (email: string) => instance.get(`/api/user?_email=${email}`),
};

export default userService;
