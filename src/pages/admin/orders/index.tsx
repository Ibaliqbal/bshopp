import AdminOrdersView from "@/views/admin/Orders";
import Head from "next/head";
import React from "react";

const OrdersPanelPage = () => {
  return (
    <section>
      <Head>
        <title>BShopp | Orders Panel</title>
        <meta name="description" content="orders user" />
      </Head>
      <AdminOrdersView />
    </section>
  );
};

export default OrdersPanelPage;
