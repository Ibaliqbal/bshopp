import { Product } from "@/types/product";
import { converPrice } from "@/utils/convertPrice";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const Card = ({
  product,
  width,
  height,
}: {
  product: Product;
  width: number;
  height: number;
}) => {
  return (
    <motion.figure
      layout
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      className="border-b-4 border-b-black shadow-md shadow-black rounded-md p-3"
    >
      <Link
        className="text-wrap relative flex flex-col h-full group overflow-hidden"
        href={`/products/${product.id}`}
      >
        <Image
          src={product.photo_product[0]}
          alt={product.name_product}
          width={width}
          height={height}
          className={`aspect-[1/1.2] group-hover:scale-110 transition-transform duration-300 ease-out w-full object-cover rounded-md`}
        />
        <article className="flex flex-col mt-4 gap-3 grow">
          <h4 className="lg:text-xl text-md md:text-lg font-semibold">
            {product.name_product}
          </h4>
          <p className="lg:text-xl text-md md:text-lg font-bold">
            {converPrice(product.other_specs![0].price)}
          </p>
          <div className="grow flex items-end">
            <p className="font-semibold md:text-lg text-sm text-gray-600">
              {product.categories?.label}
            </p>
          </div>
        </article>
        <span className="bg-green-700 w-fit p-3 rounded-br-md rounded-tl-md text-white mt-5 absolute -top-5 left-0">
          Soldout{" "}
          {product.other_specs?.reduce((acc, curr) => acc + curr.soldout, 0)}
        </span>
      </Link>
    </motion.figure>
  );
};

export default Card;
