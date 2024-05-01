import instance from "@/lib/axios/instance";

const userService = {
  get: () => instance.get(`/api/user`),
  delete: (id: string, token: string) =>
    instance.delete(`/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  detailUserByEmail: (email: string) =>
    instance.get(`/api/user?_email=${email}`),
  update: (id: string, data: any) => instance.put(`/api/user/${id}`, data),
  detail: (id: string) => instance.get(`/api/user/${id}`),
  reset: (id: string, data: any) => instance.put(`/api/user/${id}/reset`, data),
};

export default userService;
