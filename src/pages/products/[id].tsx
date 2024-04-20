import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { productsServices } from "@/services/products";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import DetailView from "@/views/products/Detail";
import Recomended from "@/views/products/Detail/Recomended";
import { Timestamp } from "firebase/firestore";
import { format, formatDistance } from "date-fns";

const DetailProductPage = () => {
  const { query, back } = useRouter();
  const id = query.id;
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectPrice, setSelectPrice] = useState<number>(0);
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["detailProduct", id],
    queryFn: () => productsServices.detailProduct((id as string) ?? ""),
    staleTime: 10000,
  });

  useEffect(() => {
    setSelectedImage(data?.data.payload.photo_product[0]);
    setSelectPrice(data?.data.payload.other_specs[0].price);
    const date = data?.data.payload.createdAt.seconds * 1000;
    if (date) {
      console.log(format(new Date(date), "MMMM d, yyyy"));
      // console.log(
      //   formatDistance(new Date(date), new Date(), {
      //     addSuffix: true,
      //   })
      // );
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
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
