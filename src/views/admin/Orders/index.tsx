import OrderCard from "@/components/Fragments/OrderCard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Orders } from "@/types/orders";
import { User } from "@/types/user";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { listVariants, variants } from "@/utils/animAction";

type Props = {
  data: {
    orders: Array<Orders>;
    users: Array<User>;
  };
};

const status = [
  {
    title: "All",
    href: "/admin/orders",
  },
  {
    title: "Paid",
    href: "/admin/orders?status=PAID",
  },
  {
    title: "Pending",
    href: "/admin/orders?status=PENDING",
  },
  {
    title: "Canceled",
    href: "/admin/orders?status=CANCELED",
  },
];

const AdminOrdersView = ({ data }: Props) => {
  const [open, setOpen] = useState({ id: "", status: false });
  const { asPath, push, query } = useRouter();
  const [orders, setOrder] = useState<Array<Orders>>(
    data.orders ? data.orders : []
  );

  useEffect(() => {
    if (!query.status) {
      setOrder(data.orders ? data?.orders : []);
    } else {
      const status = query.status as string;
      const filtered = data.orders?.filter(
        (order) => order.status === status?.toUpperCase()
      );
      setOrder(filtered);
    }
  }, [query]);
  return (
    <AdminLayout>
      <main className="w-full lg:basis-full pb-24">
        <h1 className="mb-8 text-2xl font-semibold">
          Total Orders : ( {orders.length} )
        </h1>
        <ul className="w-full mb-10 grid grid-cols-4 items-center md:text-lg text-sm gap-x-4">
          {status.map((s, i) => (
            <li
              className={`w-full ${
                asPath === s.href ? "border-b-4 border-b-green-400" : null
              } p-3 text-center pb-4 cursor-pointer`}
              key={i}
              onClick={() => push(s.href)}
            >
              {s.title}
            </li>
          ))}
        </ul>
        <motion.section className="w-full flex flex-col gap-4" layout>
          <AnimatePresence mode="popLayout">
            {orders.map((order, i) => (
              <OrderCard
                date={new Date(order.orderAt.seconds * 1000)}
                data={order}
                key={order.order_id}
                username={
                  data.users?.find((user) => user.id === order.id)?.fullname
                }
              >
                <div className="flex items-center justify-between">
                  {order.status === "PAID" ? (
                    <p className="bg-green-500 text-white inline-block p-3 px-5 rounded-full">
                      Success
                    </p>
                  ) : order.status === "PENDING" ? (
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
                            if (prev.id === order.order_id) {
                              return {
                                id: "",
                                status: false,
                              };
                            } else {
                              return {
                                id: order.order_id,
                                status: true,
                              };
                            }
                          })
                        }
                      />
                    </span>
                    <motion.ul
                      className="bg-white p-4 absolute top-5 right-3 flex flex-col gap-2 rounded-md shadow shadow-slate-900"
                      animate={
                        open.id === order.order_id && open.status
                          ? "open"
                          : "closed"
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
                        onClick={() => push(`/order/${order.order_id}`)}
                      >
                        <i className="bx bx-show text-2xl" />
                        See
                      </motion.li>
                    </motion.ul>
                  </div>
                </div>
              </OrderCard>
            ))}
          </AnimatePresence>
        </motion.section>
      </main>
    </AdminLayout>
  );
};

export default AdminOrdersView;
