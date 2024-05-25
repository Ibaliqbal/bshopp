import Loader from "@/components/ui/loader";
import { productsServices } from "@/services/products";
import AdminProductsView from "@/views/admin/Products";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";

const AdminProductPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products-owner"],
    queryFn: async () => productsServices.get(),
  });

  return (
    <section className="w-full min-h-dvh">
      <Head>
        <title>BShopp | Admin Products</title>
      </Head>
      {isLoading ? (
        <section className="flex items-center justify-center w-full h-dvh">
          <Loader className="text-black" />
        </section>
      ) : (
        <AdminProductsView products={data?.data.payload} />
      )}
    </section>
  );
};

export default AdminProductPage;
