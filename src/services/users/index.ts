import instance from "@/lib/axios/instance";

const userService = {
  getUsers: () => instance.get(`/api/user`),
  deleteUser: (id: string, token: string) =>
    instance.delete(`/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  detailUserByEmail: (email: string) =>
    instance.get(`/api/user?_email=${email}`),
  updateUser: (id: string, data: any) => instance.put(`/api/user/${id}`, data),
  detailUser: (id: string) => instance.get(`/api/user/${id}`),
};

export default userService;