import Loader from "@/components/ui/loader";
import { checkoutService } from "@/services/checkout";
import { CheckoutCart } from "@/types/checkout";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { converPrice } from "@/utils/convertPrice";
import { format } from "date-fns";

async function fetchDetail(id: string) {
  const response = await checkoutService.detail(id);
  const data = response.data.payload;

  return data;
}

const Detail = ({ id }: { id: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile-order", id],
    queryFn: () => fetchDetail(id),
  });

  if (isError) return <p>{error.message}</p>;

  return isLoading ? (
    <section className="w-full h-dvh flex items-center justify-center">
      <Loader className="text-black" />
    </section>
  ) : (
    <section className="w-full h-full flex flex-col gap-4 p-4 pb-24 relative">
      <i
        aria-label="Download page"
        className="bx bxs-download text-2xl p-2 rounded-md cursor-pointer border-2 border-black absolute right-4"
        onClick={() => window.print()}
      />
      <figure className="flex md:flex-row flex-col gap-6 items-center">
        {data.cart.map((c: CheckoutCart, i: number) => {
          return (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2 * i,
                ease: "backInOut",
              }}
              key={i}
              className="md:w-[25vw] md:h-[60vh] w-full h-[50vh] relative"
            >
              <Image
                src={c.photo}
                fill
                alt={c.name}
                className="object-cover rounded-md"
              />
            </motion.div>
          );
        })}
      </figure>
      <div className="mt-5 flex flex-col gap-5">
        <h1 className="font-semibold text-xl">Description order</h1>
        <div className="flex flex-row gap-4 items-center flex-wrap">
          <h3 className="basis-2/12 text-sm">Order ID</h3>
          <p className="basis-1/12 font-semibold">:</p>
          <p className="grow border-l-2 border-l-black px-3">{data.id}</p>
        </div>
        <div className="flex flex-row gap-4 items-center flex-wrap">
          <h3 className="basis-2/12">Total</h3>
          <p className="basis-1/12 font-semibold">:</p>
          <p className="grow border-l-2 border-l-black px-3">
            {converPrice(data.gross_amount)}
          </p>
        </div>
        <div className="flex flex-row gap-4 items-center flex-wrap">
          <h3 className="basis-2/12">Date</h3>
          <p className="basis-1/12 font-semibold">:</p>
          <p className="grow border-l-2 border-l-black px-3">
            {format(new Date(data.checkoutAt.seconds * 1000), "yyyy MMMM, dd")}
          </p>
        </div>
        <div className="flex flex-row gap-4 flex-wrap">
          <h3 className="basis-2/12">Products</h3>
          <p className="basis-1/12 font-semibold ">:</p>
          <div className="grow border-l-2 border-l-black flex flex-col gap-4 px-3">
            {data.cart.map((cart: CheckoutCart, i: number) => (
              <div className="flex gap-6" key={cart.id}>
                <h4>{i + 1}.</h4>
                <div className="grow flex flex-col gap-2">
                  <div className="flex flex-row gap-4 items-center flex-wrap">
                    <h3 className="basis-2/12">Name</h3>
                    <p className="basis-1/12 font-semibold">:</p>
                    <p className="grow">{cart.name}</p>
                  </div>
                  <div className="flex flex-row gap-4 items-center flex-wrap">
                    <h3 className="basis-2/12">Category</h3>
                    <p className="basis-1/12 font-semibold">:</p>
                    <p className="grow">{cart.category}</p>
                  </div>
                  <div className="flex flex-row gap-4 items-center flex-wrap">
                    <h3 className="basis-2/12">Variant</h3>
                    <p className="basis-1/12 font-semibold">:</p>
                    <p className="grow">{cart.variant}</p>
                  </div>
                  <div className="flex flex-row gap-4 items-center flex-wrap">
                    <h3 className="basis-2/12">Price</h3>
                    <p className="basis-1/12 font-semibold">:</p>
                    <p className="grow">{converPrice(cart.price)}</p>
                  </div>
                  <div className="flex flex-row gap-4 items-center flex-wrap">
                    <h3 className="basis-2/12">Quantity</h3>
                    <p className="basis-1/12 font-semibold">:</p>
                    <p className="grow">{cart.qty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
