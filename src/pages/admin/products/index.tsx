import { productsServices } from "@/services/products";
import { Product } from "@/types/product";
import AdminProductsView from "@/views/admin/Products";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const AdminProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const getProducts = async () => {
    const res = await productsServices.get();
    const data = res.data.payload;
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <section className="w-full min-h-dvh">
      <Head>
        <title>BShopp | Admin Products</title>
      </Head>
      <AdminProductsView products={products} fetchProducts={getProducts} />
    </section>
  );
};

export default AdminProductPage;
