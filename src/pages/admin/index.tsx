import userService from "@/services/users";
import AdminView from "@/views/admin";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const AdminPage = () => {
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
      <AdminView />
    </section>
  );
};

export default AdminPage;
