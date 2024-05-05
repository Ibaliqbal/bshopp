import Card from "@/components/Fragments/CardProduct";
import { productsServices } from "@/services/products";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Recomended({ filter }: { filter: number }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recomended", filter],
    queryFn: () => productsServices.recomended(filter.toString(), "desc"),
    staleTime: 60 * 60 * 24,
  });
  if (isLoading) return <p>Loading....</p>;
  if (isError) return <p>{error.message}</p>;
  return (
    <section>
      <h3 className="text-2xl font-semibold">Recommended products for you</h3>
      <section className="flex gap-3 items-center mt-4 overflow-x-scroll max-w-layout w-full p-4">
        {data?.data.payload.map((item: Product) => (
          <Card height={150} width={150} product={item} key={item.id} />
        ))}
      </section>
    </section>
  );
}
