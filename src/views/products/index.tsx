import Card from "@/components/Fragments/CardProduct";
import { Product } from "@/types/product";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type ProductsViewProps = {
  products: Product[];
};

const ProductsView = ({ products }: ProductsViewProps) => {
  return (
    <section className="lg:basis-full">
      {products?.length > 0 ? (
        <motion.main
          layout
          className="grid grid-cols-2 md:grid-cols-4 w-full gap-4"
        >
          <AnimatePresence>
            {products?.map((product) => (
              <Card
                key={product.id}
                product={product}
                width={600}
                height={500}
              />
            ))}
          </AnimatePresence>
        </motion.main>
      ) : (
        <div className="w-full h-dvh flex items-center justify-center flex-col">
          <Image
            src={"/notfound.png"}
            width={400}
            height={400}
            alt="Not Found"
          />
          <h3 className="font-bold text-2xl">Products not found</h3>
        </div>
      )}
    </section>
  );
};

export default ProductsView;
