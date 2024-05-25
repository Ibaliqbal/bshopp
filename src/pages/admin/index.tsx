import AdminView from "@/views/admin";
import Head from "next/head";
import React from "react";

const AdminPage = () => {
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
