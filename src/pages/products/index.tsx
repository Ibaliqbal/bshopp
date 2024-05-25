import Sidebar from "@/components/layouts/SidebarHome";
import ListFilter from "@/components/layouts/SidebarHome/ListFilter";
import Loader from "@/components/ui/loader";
import { productsServices } from "@/services/products";
import {
  Product,
  SORTING_OPT,
  mensOption,
  sortingOption,
  womensOption,
} from "@/types/product";
import { sortProducts } from "@/utils/sortProducts";
import ProductsView from "@/views/products";
import Header from "@/views/products/header";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const ProductsPage = () => {
  const [datas, setDatas] = useState<any[]>([]);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [selectOptions, setSelectOptions] = React.useState<number>(0);
  const [sortingOptions, setSortingOption] = React.useState<number>(0);
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await productsServices.get(),
    staleTime: 10000,
  });

  useEffect(() => {
    setDatas(data?.data.payload);
    setFilterProducts(data?.data.payload);
  }, [data]);

  // Ini untuk infinite scroll pagination

  // async function handleLoadMore() {
  //   if (count === 0) return toast.success("SUdah berhasil sampai selesai");
  //   const res = await productsServices.getProductsPaginations(start, limit);
  //   const data = res.data;
  //   setDatas((prev: any) => [...prev, ...data.payload]);
  //   setFilterProducts((prev) => [...prev, ...data.payload]);
  //   setCount(res.data.count);
  //   setFilterCount(res.data.count);
  //   setStart(start + 1);
  // }

  const handleFilter = (value: number) => {
    if (sortingOptions) {
      if (value === selectOptions) {
        setSelectOptions(0);
        const data = sortProducts(datas, sortingOptions);
        setFilterProducts(data as Product[]);
      } else {
        const data = sortProducts(datas, sortingOptions);
        const filterDatas = data?.filter(
          (product: Product) => product.categories?.value === value
        );
        setFilterProducts(filterDatas as Product[]);
        setSelectOptions(value);
      }
    } else {
      if (value === selectOptions) {
        setSelectOptions(0);
        setFilterProducts(datas);
      } else {
        const filterDatas = datas.filter(
          (product: any) => product.categories.value === value
        );
        setFilterProducts(filterDatas);
        setSelectOptions(value);
      }
    }
  };

  const handleSorting = (value: number) => {
    setSortingOption(value);
    const data = sortProducts(filterProducts, value);
    setFilterProducts(data as Array<Product>);
  };

  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <Head>
        <title>BShopp | Products</title>
      </Head>
      <Header sortingOption={sortingOptions} handleSorting={handleSorting}>
        <section className="bg-black p-3 mt-3 rounded-md md:hidden flex flex-col gap-6">
          <ListFilter
            list={sortingOption}
            handleFilter={handleSorting}
            title="Sorting"
            selectOptions={sortingOptions}
          />
          <ListFilter
            list={mensOption}
            selectOptions={selectOptions}
            title="MEN"
            handleFilter={handleFilter}
          />
          <ListFilter
            list={womensOption}
            selectOptions={selectOptions}
            title="WOMEN"
            handleFilter={handleFilter}
          />
        </section>
      </Header>
      <section className="w-full h-full flex gap-4 p-4 pt-8 pb-24">
        <Sidebar total={filterProducts?.length}>
          <ListFilter
            list={mensOption}
            selectOptions={selectOptions}
            title="MEN"
            handleFilter={handleFilter}
          />
          <ListFilter
            list={womensOption}
            selectOptions={selectOptions}
            title="WOMEN"
            handleFilter={handleFilter}
          />
        </Sidebar>
        {isLoading ? (
          <div className="w-full h-dvh flex items-center justify-center">
            <Loader className="text-black" />
          </div>
        ) : (
          <ProductsView products={filterProducts} />
        )}
      </section>
    </>
  );
};

export default ProductsPage;

// untuk mengambil data dari sis server

// export async function getServerSideProps() {
//   const limit = 5;
//   const res = await productsServices.getProductsPaginations(1, limit);
//   const result = await productsServices.getProducts();
//   const products = res.data.payload;
//   const allProducts = result.data.payload;
//   const count = res.data.count;
//   const total = res.data.total;
//   return {
//     props: {
//       products,
//       count,
//       allProducts,
//       limit,
//       total,
//     },
//   };
// }
