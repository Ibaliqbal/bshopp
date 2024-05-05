import { TCheckout } from "@/types/checkout";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/router";

const OrderList = ({ order }: { order: any[] }) => {
  const [open, setOpen] = useState({ id: "", status: false });
  const router = useRouter();

  useEffect(() => {
    const mkidtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = mkidtransUrl;
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const variants = {
    open: {
      opacity: 1,
      scale: 1,
      transformOrigin: "top right",
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.4,
        duration: 0.5,
        type: "spring",
      },
    },
    closed: {
      opacity: 0,
      scale: 0,
      transformOrigin: "top right",
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        delayChildren: 0.03,
        duration: 0.5,
        type: "spring",
        delay: 0.4,
      },
    },
  };

  const listVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 20,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

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
    <section className="w-full flex flex-col items-center gap-4">
      {order.map((o: TCheckout, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2, ease: "backInOut" }}
          key={o.order_id}
          className="w-full shadow-md shadow-slate-900 rounded-md p-3 pb-5"
        >
          <div className="mb">
            {o.cart.map((c) => {
              return (
                <div key={c.id} className="p-4 flex md:flex-row flex-col gap-3">
                  <Image
                    src={c.photo}
                    alt={c.name}
                    width={150}
                    height={150}
                    priority
                  />
                  <article>
                    <h5>
                      {c.name} | {c.variant}
                    </h5>
                    <p>{c.category}</p>
                    <p>{c.qty}</p>
                  </article>
                </div>
              );
            })}
          </div>
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
                  >
                    <i className="bx bx-show text-2xl" />
                    See
                  </motion.li>{" "}
                  <motion.li
                    variants={listVariants}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <i className="bx bx-x text-2xl" />
                    Cancel
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
                  >
                    <i className="bx bx-show text-2xl" />
                    See
                  </motion.li>
                  <motion.li
                    variants={listVariants}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <i className="bx bx-x text-2xl" />
                    Cancel
                  </motion.li>
                </motion.ul>
              )}
            </div>
          </div>
        </motion.div>
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
