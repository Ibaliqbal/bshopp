import Sidebar from "@/components/layouts/SidebarHome";
import ListFilter from "@/components/layouts/SidebarHome/ListFilter";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { productsServices } from "@/services/products";
import {
  Product,
  mensOption,
  sortingOption,
  womensOption,
} from "@/types/product";
import { sortProducts } from "@/utils/sortProducts";
import ProductsView from "@/views/products";
import Header from "@/views/products/header";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export const filterOption = [
  {
    label: "mens",
    value: mensOption.map((option) => option.value),
  },
  {
    label: "womens",
    value: womensOption.map((option) => option.value),
  },
];

const SearchProductPage = () => {
  const { query } = useRouter();
  const params = query.q as string;
  // const limit = 1;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchProduct", params],
    queryFn: () => productsServices.search(params),
    staleTime: 10000,
  });
  const [filterDatas, setFilterDatas] = useState<Product[]>([]);
  const [selectOptions, setSelectOptions] = React.useState<number[]>([]);
  const [sortingOptions, setSortingOptions] = React.useState<number>(0);

  // ini fungsi untuk pagination

  // async function handleLoadMore() {
  //   if (count === 0) return toast.success("SUdah berhasil sampai selesai");
  //   const res = await productsServices.getProductsSearchAndPagination(
  //     params,
  //     limit,
  //     start
  //   );
  //   const data = res.data;
  //   setDatas((prev: any) => [...prev, ...data.payload]);
  //   setCount(res.data.count);
  //   setStart(start + 1);
  // }

  useEffect(() => {
    setFilterDatas(data?.data.payload);
  }, [data]);

  const handleFilter = (value: number[]) => {
    if (sortingOptions) {
      if (JSON.stringify(value) === JSON.stringify(selectOptions)) {
        setSelectOptions([]);
        const datas = sortProducts(data?.data.payload, sortingOptions);
        setFilterDatas(datas as Product[]);
      } else {
        const datas = sortProducts(data?.data.payload, sortingOptions);
        const filterDatas = datas?.filter((product: Product) =>
          value.includes(product.categories?.value as number)
        );
        setFilterDatas(filterDatas as Product[]);
        setSelectOptions(value);
      }
    } else {
      if (JSON.stringify(value) === JSON.stringify(selectOptions)) {
        setSelectOptions([]);
        setFilterDatas(data?.data.payload);
      } else {
        const filterDatas = data?.data.payload.filter((product: Product) =>
          value.includes(product.categories?.value as number)
        );
        setFilterDatas(filterDatas);
        setSelectOptions(value);
      }
    }
  };

  const handleSorting = (value: number) => {
    setSortingOptions(value);
    const data = sortProducts(filterDatas, value);
    setFilterDatas(data as Array<Product>);
  };
  if (isLoading)
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Loader className="text-black" />
      </div>
    );
  if (isError) return <p>{error.message}</p>;
  return (
    <>
      <Head>
        <title>BShopp | Search Product</title>
      </Head>
      <Header handleSorting={handleSorting} sortingOption={sortingOptions}>
        <div className="bg-black p-3 mt-3 rounded-md md:hidden flex flex-col gap-6">
          <ListFilter
            list={sortingOption}
            handleFilter={handleSorting}
            title="Sorting"
            selectOptions={sortingOptions}
          />
          <section className="text-white md:hidden">
            <h1 className="text-gray-300 font-bold">FILTER BY</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {filterOption.map((option, i) => (
                <Button
                  sizes="sm"
                  className={`transition-all duration-200 ease-out uppercase ${
                    JSON.stringify(option.value) ===
                    JSON.stringify(selectOptions)
                      ? "bg-white text-black"
                      : "border-2 border-white"
                  }`}
                  key={i}
                  onClick={() => handleFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </section>
        </div>
      </Header>
      <section className="w-full h-full flex gap-4 p-4 pb-24">
        <Sidebar total={filterDatas?.length}>
          <section className="text-white">
            <h1 className="text-gray-300 font-bold">FILTER BY</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {filterOption.map((option, i) => (
                <Button
                  sizes="sm"
                  className={`transition-all duration-200 ease-out uppercase ${
                    JSON.stringify(option.value) ===
                    JSON.stringify(selectOptions)
                      ? "bg-white text-black"
                      : "border-2 border-white"
                  }`}
                  key={i}
                  onClick={() => handleFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </section>
        </Sidebar>
        <ProductsView products={filterDatas} />
      </section>
    </>
  );
};

export default SearchProductPage;

// ini untuk melakukan fetch dari sisi server

// export async function getServerSideProps({ query }: { query: any }) {
//   console.log(query);
//   const limit = 1;
//   const start = 1;
//   const res = await productsServices.getProductsSearchAndPagination(
//     query.q,
//     limit,
//     start
//   );
//   const count = res.data.count;
//   const total = res.data.total;
//   const products = res.data.payload;
//   return {
//     props: {
//       products,
//       limit,
//       start,
//       count,
//       total,
//     },
//   };
// }
