import userService from "@/services/users";
import AdminUserView from "@/views/admin/Users";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const AdminUserPage = () => {
  const [user, setUser] = useState<any>([]);

  const getUser = async () => {
    const res = await userService.get();
    const data = res.data.payload;
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <section className="w-full">
      <Head>
        <title>BShopp | Admin</title>
      </Head>
      <AdminUserView users={user} fetchUser={getUser} />
    </section>
  );
};

export default AdminUserPage;
