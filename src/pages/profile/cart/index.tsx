import CartView from "@/views/profile/Cart";
import Head from "next/head";
import React from "react";

export default function CartPage() {
  return (
    <>
      <Head>
        <title>BShopp | Cart</title>
        <meta name="description" content="main cart user" />
      </Head>
      <section className="w-full">
        <CartView />
      </section>
    </>
  );
}
