import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import DetailView from "@/views/products/Detail";
import Recomended from "@/views/products/Detail/Recomended";
import Loader from "@/components/ui/loader";
import { fetchData } from "@/function/product";

const DetailProductPage = () => {
  const { query, back } = useRouter();
  const id = query.id;
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectPrice, setSelectPrice] = useState<number>(0);
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["detailProduct", id],
    queryFn: () => fetchData(id as string),
    staleTime: 10000,
  });

  useEffect(() => {
    setSelectedImage(data?.product?.photo_product[0]);
    setSelectPrice(data?.product?.other_specs[0].price);
  }, [data]);

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
        <title>BShopp | {data?.product?.name_product}</title>
        <meta name="description" content={data?.product?.description} />
      </Head>
      <main className="p-4 py-10">
        <i
          className="bx bx-left-arrow-alt text-5xl cursor-pointer  "
          onClick={() => back()}
        />
        <DetailView
          selectPrice={selectPrice}
          selectedImage={selectedImage}
          data={data?.product || []}
          setSelectedImage={setSelectedImage}
          setSelectPrice={setSelectPrice}
          comments={data?.comments || []}
        />
        <Recomended filter={data?.product?.categories.value} />
      </main>
    </>
  );
};

export default DetailProductPage;
