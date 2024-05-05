import ProfileLayout from "@/components/layouts/ProfileLayout";
import OrderList from "@/components/Porfile/OrderList";
import Loader from "@/components/ui/loader";
import { useOrder } from "@/context/order/order.context";
import { useUser } from "@/context/user/user.context";
import { checkoutService } from "@/services/checkout";
import { TStatus } from "@/services/checkout/service";
import { User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const status = [
  {
    title: "All",
    href: "/profile/order",
  },
  {
    title: "Paid",
    href: "/profile/order?status=PAID",
  },
  {
    title: "Pending",
    href: "/profile/order?status=PENDING",
  },
  {
    title: "Canceled",
    href: "/profile/order?status=CANCELED",
  },
];

const OrderView = () => {
  const user: User = useUser();
  const [loading, setLoading] = useState(false);
  // const order = useOrder();
  const [order, setOrder] = useState<any[]>([]);
  const { query, push, asPath } = useRouter();

  const getOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await checkoutService.get(user?.id || "");
      const data = res.data.payload;
      setOrder(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilterOrders = async (status: TStatus) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await checkoutService.filter(user?.id || "", status);
      const data = res.data.payload;
      setOrder(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      if (query.status) {
        getFilterOrders(query.status as TStatus);
      } else {
        getOrders();
      }
    }
  }, [query, user]);

  return (
    <ProfileLayout>
      {loading ? (
        <div className="w-full h-dvh flex items-center justify-center">
          <Loader className="text-black" />
        </div>
      ) : (
        <div className="pt-10 pb-24 gap-4 w-full">
          <h1 className="text-xl font-bold mb-5">Your order</h1>
          <ul className="w-full grid grid-cols-4 items-center text-lg gap-x-4 mb-8">
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
          <OrderList order={order} />
        </div>
      )}
    </ProfileLayout>
  );
};

export default OrderView;
