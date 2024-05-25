import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TCheckout } from "@/types/checkout";
import { Orders } from "@/types/orders";
import { converPrice } from "@/utils/convertPrice";
import { formatDistance } from "date-fns";

type Props = {
  children?: React.ReactElement;
  data: TCheckout | Orders;
  username?: string;
  date: Date;
};

const OrderCard = ({ children, data, username, date }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: -30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      layout
      transition={{ duration: 0.8, ease: "backInOut" }}
      className="w-full shadow-md shadow-slate-900 rounded-md p-3 pb-5"
    >
      {username && (
        <h1 className="my-4 ml-3 text-lg font-semibold capitalize">
          Customer : {username}
        </h1>
      )}
      <div className="mb-2">
        {data.cart.map((c) => {
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
                <p>Category : {c.category}</p>
                <p>Quantity : {c.qty}</p>
                <p>Price : {converPrice(c.price)}</p>
              </article>
            </div>
          );
        })}
        <p className="p-4">
          {formatDistance(date, new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
      {children}
    </motion.div>
  );
};

export default OrderCard;
