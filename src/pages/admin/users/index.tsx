import Loader from "@/components/ui/loader";
import userService from "@/services/users";
import AdminUserView from "@/views/admin/Users";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";

const AdminUserPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => await userService.get(),
    staleTime: 1000,
  });

  return (
    <section className="w-full">
      <Head>
        <title>BShopp | Admin</title>
      </Head>
      {isLoading ? (
        <section className="w-full h-dvh flex items-center justify-center">
          <Loader className="text-black" />
        </section>
      ) : (
        <AdminUserView users={data?.data.payload} />
      )}
    </section>
  );
};

export default AdminUserPage;
