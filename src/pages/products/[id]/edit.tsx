import EditView from "@/views/products/Edit";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const EditPage = () => {
  const { query } = useRouter();
  return (
    <section>
      <Head>
        <title>BShopp | Create Product</title>
      </Head>
      <EditView id={query.id as string} />
    </section>
  );
};

export default EditPage;
