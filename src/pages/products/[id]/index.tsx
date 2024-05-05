import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { productsServices } from "@/services/products";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import DetailView from "@/views/products/Detail";
import Recomended from "@/views/products/Detail/Recomended";
import { Timestamp } from "firebase/firestore";
import { format, formatDistance } from "date-fns";
import Loader from "@/components/ui/loader";

const DetailProductPage = () => {
  const { query, back } = useRouter();
  const id = query.id;
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectPrice, setSelectPrice] = useState<number>(0);
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["detailProduct", id],
    queryFn: () => productsServices.detail((id as string) ?? ""),
    staleTime: 10000,
  });

  useEffect(() => {
    setSelectedImage(data?.data.payload.photo_product[0]);
    setSelectPrice(data?.data.payload.other_specs[0].price);
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
        <title>BShopp | {data?.data.payload.name_product}</title>
        <meta name="description" content={data?.data.payload.description} />
      </Head>
      <main className="p-4 py-10">
        <i
          className="bx bx-left-arrow-alt text-5xl cursor-pointer  "
          onClick={() => back()}
        />
        <DetailView
          selectPrice={selectPrice}
          selectedImage={selectedImage}
          data={data?.data.payload}
          setSelectedImage={setSelectedImage}
          setSelectPrice={setSelectPrice}
        />
        <Recomended filter={data?.data.payload.categories.value} />
      </main>
    </>
  );
};

export default DetailProductPage;
