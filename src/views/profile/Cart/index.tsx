import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { CartContext, useCart } from "@/context/cart/cart.context";
import { converPrice } from "@/utils/convertPrice";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import Summary from "./Summary";
import { AlertDelete } from "@/lib/sweetalert/alert";
import { toast } from "sonner";

export default function CartView() {
  const carts = useCart();
  const method = useContext(CartContext);

  return (
    <ProfileLayout>
      {carts && carts.length > 0 ? (
        <section className="pt-10 pb-24 grid md:grid-cols-3 gap-4">
          <main className="md:col-span-2 w-full">
            <h1 className="font-semibold text-2xl">Cart Products</h1>
            <Label
              htmlFor="all"
              className="flex items-center gap-4 mt-4 text-xl"
            >
              <Input
                id="all"
                type="checkbox"
                checked={carts?.every((cart) => cart.checked)}
                onChange={() => method?.handleCheckoutAll()}
                className="w-5 h-5"
              />
              All Products
            </Label>
            <div className="mt-10 flex flex-col gap-8">
              {carts?.map((cart, i) => {
                return (
                  <motion.article
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 * i }}
                    key={i}
                    className="grid grid-cols-4 gap-4 border-b border-b-slate-700 pb-4"
                  >
                    <div className="flex items-center gap-3 col-span-1">
                      <Input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={cart.checked}
                        onChange={() =>
                          method?.handleCheckout(
                            cart.id,
                            cart.variant as string
                          )
                        }
                      />
                      <Link
                        href={`/products/${cart.id}`}
                        className="w-[200px] h-[200px]"
                      >
                        <Image
                          src={cart.photo}
                          alt={cart.name}
                          width={200}
                          height={200}
                          priority
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="col-span-2 flex flex-col gap-3">
                      <h4 className="text-xl">{cart.name}</h4>
                      <p className="text-gray-600 font-bold">{cart.category}</p>
                      <div className="flex gap-6 items-center mt-4">
                        <p>{cart.variant}</p>
                        <div className="flex items-center gap-3">
                          <Button
                            sizes="sm"
                            className="text-white font-bold"
                            onClick={() => {
                              if (cart.quantity === 1) {
                                return;
                              } else {
                                method?.handleQuantity(
                                  cart.id,
                                  cart.variant as string,
                                  "dec"
                                );
                              }
                            }}
                          >
                            -
                          </Button>
                          <p>{cart.quantity}</p>
                          <Button
                            sizes="sm"
                            className="text-white font-bold"
                            onClick={() =>
                              method?.handleQuantity(
                                cart.id,
                                cart.variant as string,
                                "inc"
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <i
                        className="bx bx-trash cursor-pointer text-xl"
                        onClick={() =>
                          AlertDelete((result: boolean) =>
                            result
                              ? method?.handleDelete(
                                  cart.id,
                                  cart.variant as string
                                )
                              : toast.error("Error, please try again")
                          )
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <p>{converPrice(cart.price * cart.quantity)}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </main>
          <Summary carts={carts} />
        </section>
      ) : (
        <section className="w-full h-dvh flex items-center justify-center">
          <div className="flex flex-col gap-6 items-center">
            <Image
              src={"/cart.svg"}
              alt="no-cart"
              width={400}
              height={400}
              priority
            />
            <h3 className="font-semibold text-xl">
              No cart, please select{" "}
              <Link className="text-blue-600" href={"/products"}>
                product
              </Link>
            </h3>
          </div>
        </section>
      )}
    </ProfileLayout>
  );
}
