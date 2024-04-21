import Card from "@/components/Fragments/CardProduct";
import { Product } from "@/types/product";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

type ProductsViewProps = {
  products: Product[];
};

const ProductsView = ({ products }: ProductsViewProps) => {
  return (
    <section className="lg:basis-full">
      <motion.main
        layout
        className="grid grid-cols-2 md:grid-cols-4 w-full gap-4"
      >
        <AnimatePresence>
          {products?.map((product) => (
            <Card key={product.id} product={product} width={600} height={500} />
          ))}
        </AnimatePresence>
      </motion.main>
    </section>
  );
};

export default ProductsView;
