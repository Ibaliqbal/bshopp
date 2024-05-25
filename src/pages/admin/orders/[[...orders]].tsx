import Loader from "@/components/ui/loader";
import { ordersService } from "@/services/orders";
import userService from "@/services/users";
import { Orders } from "@/types/orders";
import { User } from "@/types/user";
import AdminOrdersView from "@/views/admin/Orders";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";

async function fetchDatas() {
  const resUser = await userService.get();
  const resOrders = await ordersService.get();
  const dataUsers = resUser.data.payload;
  const dataOrders = resOrders.data.payload;

  return { orders: dataOrders, users: dataUsers };
}

const OrdersPanelPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await fetchDatas(),
  });
  return (
    <section>
      <Head>
        <title>BShopp | Orders Panel</title>
        <meta name="description" content="orders user" />
      </Head>
      {isLoading ? (
        <section className="flex justify-center items-center w-full h-dvh">
          <Loader className="text-black" />
        </section>
      ) : (
        <AdminOrdersView
          data={
            data as {
              orders: Array<Orders>;
              users: Array<User>;
            }
          }
        />
      )}
    </section>
  );
};

export default OrdersPanelPage;
