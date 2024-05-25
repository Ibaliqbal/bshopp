import ProfileLayout from "@/components/layouts/ProfileLayout";
import OrderList from "@/components/Porfile/OrderList";
import Loader from "@/components/ui/loader";
import { useUser } from "@/context/user/user.context";
import { checkoutService } from "@/services/checkout";
import { TStatus } from "@/services/checkout/service";
import { User } from "@/types/user";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Detail from "./Detail";
import { TCheckout } from "@/types/checkout";

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
  const [order, setOrder] = useState<TCheckout[]>([]);
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
    const mkidtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = mkidtransUrl;
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    script.async = true;

    document.body.appendChild(script);
    if (query) {
      if (query.status) {
        getFilterOrders(query.status as TStatus);
      } else {
        getOrders();
      }
    }
    return () => {
      document.body.removeChild(script);
    };
  }, [query, user]);

  return query.order ? (
    <Detail id={query.order[0] as string} />
  ) : (
    <ProfileLayout>
      {loading ? (
        <div className="w-full h-dvh flex items-center justify-center">
          <Loader className="text-black" />
        </div>
      ) : (
        <div className="pt-10 pb-24 gap-4 w-full">
          <h1 className="text-xl font-bold mb-5">
            Your order ( {order.length} )
          </h1>
          <ul className="w-full grid grid-cols-4 items-center md:text-lg text-sm gap-x-4 mb-8">
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
