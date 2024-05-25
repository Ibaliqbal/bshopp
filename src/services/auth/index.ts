import instance from "@/lib/axios/instance";

const authServices = {
  registerAccount: (data: {
    fullname: string;
    email: string;
    password: string;
  }) => instance.post("/api/user/register", data),
};

export default authServices;
