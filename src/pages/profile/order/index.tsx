import OrderView from "@/views/profile/Order";
import Head from "next/head";
import React from "react";

const OrderPage = () => {
  return (
    <>
      <Head>
        <title>BShopp | Order</title>
        <meta name="description" content="order user" />
      </Head>
      <section className="w-full">
        <OrderView />
      </section>
    </>
  );
};

export default OrderPage;
