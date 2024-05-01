import Card from "@/components/Fragments/CardProduct";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import Button from "@/components/ui/button";
import { useFavorite } from "@/context/favorite/favorite.context";
import { mensOption, Product, womensOption } from "@/types/product";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
export default function FavoriteView() {
  const fav = useFavorite();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectOption, setSelectOption] = React.useState({
    value: 0,
    label: "",
  });

  React.useEffect(() => {
    setProducts(fav);
  }, [fav]);

  const handleFilter = (val: { value: number; label: string }) => {
    if (val === selectOption) {
      setSelectOption({
        value: 0,
        label: "",
      });
      setProducts(fav);
    } else {
      const filterDatas = fav?.filter(
        (product: any) => product.categories.value === val.value
      );
      setProducts(filterDatas);
      setSelectOption(val);
    }
  };

  return (
    <ProfileLayout>
      <section className="w-full pt-4 pb-24">
        <h1 className="text-xl font-bold mb-5">Your favorite products</h1>
        <div className="w-full mb-8">
          <h3 className="mb-3 text-xl font-semibold">
            Select filter ( {selectOption.label} )
          </h3>
          <div className="w-full flex flex-wrap justify-center gap-3">
            {[...mensOption, ...womensOption].map((filter, i) => (
              <Button
                key={filter.value}
                onClick={() => handleFilter(filter)}
                sizes="sm"
                className={`text-white ${
                  selectOption.value === filter.value
                    ? "bg-opacity-60"
                    : "bg-opacity-100"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
        {products?.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 w-full gap-4"
          >
            <AnimatePresence>
              {products?.map((product) => (
                <Card
                  product={product}
                  key={product.id}
                  width={300}
                  height={300}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <section className="w-full h-dvh flex items-center justify-center">
            <div className="flex flex-col gap-6 items-center">
              <Image
                src={"/favorite.png"}
                alt="no-cart"
                width={400}
                height={400}
                priority
              />
              <h3 className="font-semibold text-xl">
                No favorite, please select product
              </h3>
            </div>
          </section>
        )}
      </section>
    </ProfileLayout>
  );
}
