import { TCheckout } from "@/types/checkout";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/router";
import OrderCard from "../Fragments/OrderCard";
import { useMutation } from "@tanstack/react-query";
import Loader from "../ui/loader";
import { checkoutService } from "@/services/checkout";
import { ordersService } from "@/services/orders";
import { listVariants, variants } from "@/utils/animAction";

const OrderList = ({ order }: { order: TCheckout[] }) => {
  const [open, setOpen] = useState({ id: "", status: false });
  const router = useRouter();

  const { mutate: handle, isPending } = useMutation({
    mutationFn: async (data: { id: string; type: string }) => {
      if (data.type === "CANCEL") {
        const [checkout, order] = await Promise.all([
          checkoutService.updateStatus(data.id, {
            status: "CANCELED",
          }),
          ordersService.updateStatus(data.id, { status: "CANCELED" }),
        ]);
        return { resChcekout: checkout, resOrder: order, type: "CANCEL" };
      } else {
        const [checkout, order] = await Promise.all([
          checkoutService.delete(data.id),
          ordersService.delete(data.id),
        ]);
        return { resChcekout: checkout, resOrder: order, type: "REMOVE" };
      }
    },
    onSuccess: async (res) => {
      if (res.resChcekout.status === 200 || res.resOrder.status === 200) {
        toast.success(res.resChcekout.data.message);
        router.replace(
          res.type === "CANCEL"
            ? "/profile/order?status=CANCELED"
            : "/profile/order"
        );
      } else {
        toast.error(res.resChcekout.data.message);
        console.log("error");
      }
    },
  });

  const handlePay = (token: string) => {
    // @ts-expect-error
    window.snap?.pay(token, {
      onSuccess: async () => {
        router.replace("/profile/order");
        toast.success("Payment successfully");
      },
      onPending: () => {
        router.replace("/profile/order");
        toast.success("Waiting for paymnet");
      },
      onError: () => {
        toast.error("Gagal");
      },
      onClose: () => {
        router.replace("/profile/order");
        toast.error("You have not completed the payment...");
      },
    });
  };

  return order && order.length > 0 ? (
    <section className="w-full flex flex-col items-center gap-4 relative">
      {isPending && (
        <section className="fixed top-0 left-0 w-full h-dvh flex items-center justify-center bg-black z-50 bg-opacity-60">
          <Loader className="text-white" />
        </section>
      )}
      {order.map((o: TCheckout, i) => (
        <OrderCard
          data={o}
          key={o.order_id}
          date={new Date(o.checkoutAt.seconds * 1000)}
        >
          <div className="flex items-center justify-between">
            {o.status === "PAID" ? (
              <p className="bg-green-500 text-white inline-block p-3 px-5 rounded-full">
                Success
              </p>
            ) : o.status === "PENDING" ? (
              <p className="bg-blue-500 text-white inline-block p-3 px-5 rounded-full">
                Pending
              </p>
            ) : (
              <p className="bg-red-500 text-white inline-block p-3 px-5 rounded-full">
                Cancel
              </p>
            )}
            <div className="relative">
              <span>
                <i
                  className="bx bx-dots-vertical-rounded text-2xl cursor-pointer"
                  onClick={() =>
                    setOpen((prev) => {
                      if (prev.id === o.order_id) {
                        return {
                          id: "",
                          status: false,
                        };
                      } else {
                        return {
                          id: o.order_id,
                          status: true,
                        };
                      }
                    })
                  }
                />
              </span>
              {o.status === "PAID" ? (
                <motion.ul
                  className="bg-white p-4 absolute top-5 right-3 flex flex-col gap-2 rounded-md shadow shadow-slate-900"
                  animate={
                    open.id === o.order_id && open.status ? "open" : "closed"
                  }
                  variants={variants}
                >
                  <motion.li
                    variants={listVariants}
                    className="font-bold pb-1 border-b-2 border-b-black"
                  >
                    Actions
                  </motion.li>
                  <motion.li
                    variants={listVariants}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push(`/profile/order/${o.order_id}`)}
                  >
                    <i className="bx bx-show text-2xl" />
                    See
                  </motion.li>
                </motion.ul>
              ) : o.status === "PENDING" ? (
                <motion.ul
                  className="bg-white p-4 absolute top-5 right-3 flex flex-col gap-2 rounded-md shadow shadow-slate-900"
                  animate={
                    open.id === o.order_id && open.status ? "open" : "closed"
                  }
                  variants={variants}
                >
                  <motion.li
                    variants={listVariants}
                    className="font-bold pb-1 border-b-2 border-b-black"
                  >
                    Actions
                  </motion.li>
                  <motion.li
                    variants={listVariants}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handlePay(o.token)}
                  >
                    <i className="bx bx-money-withdraw text-2xl" />
                    Pay
                  </motion.li>

                  <motion.li
                    variants={listVariants}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handle({ id: o.order_id, type: "CANCEL" })}
                  >
                    <i className="bx bx-x text-2xl" />
                    Cancel
                  </motion.li>
                </motion.ul>
              ) : (
                <motion.ul
                  className="bg-white p-4 absolute top-5 right-3 flex flex-col gap-2 rounded-md shadow shadow-slate-900"
                  animate={
                    open.id === o.order_id && open.status ? "open" : "closed"
                  }
                  variants={variants}
                >
                  <motion.li
                    variants={listVariants}
                    className="font-bold pb-1 border-b-2 border-b-black"
                  >
                    Actions
                  </motion.li>
                  <motion.li
                    variants={listVariants}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push(`/profile/order/${o.order_id}`)}
                  >
                    <i className="bx bx-show text-2xl" />
                    See
                  </motion.li>
                  <motion.li
                    variants={listVariants}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handle({ id: o.order_id, type: "REMOVE" })}
                  >
                    <i className="bx bx-x text-2xl" />
                    Remove
                  </motion.li>
                </motion.ul>
              )}
            </div>
          </div>
        </OrderCard>
      ))}
    </section>
  ) : (
    <section className="w-full h-dvh flex items-center justify-center">
      <div className="flex flex-col gap-6 items-center">
        <Image
          src={"/order.svg"}
          alt="no-cart"
          width={400}
          height={400}
          priority
        />
        <h3 className="font-semibold text-xl">
          No order, checkout products{" "}
          <Link href={"/products"} className="text-blue-600">
            now!
          </Link>
        </h3>
      </div>
    </section>
  );
};

export default OrderList;
