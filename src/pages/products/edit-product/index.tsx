import ProductCreateView from "@/views/products/Create";
import Head from "next/head";
import React from "react";

export default function EditProductPage() {
  return (
    <section>
      <Head>
        <title>BShopp | Create Product</title>
      </Head>
      <ProductCreateView />
    </section>
  );
}
