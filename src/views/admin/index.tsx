import AdminLayout from "@/components/layouts/AdminLayout";
import TextGenerateEffect from "@/components/ui/text-generate-effect";
import { useSession } from "next-auth/react";
import React from "react";
import { Line, Bar, Pie, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { ordersService } from "@/services/orders";
import { MONTH } from "@/constant";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/ui/loader";
import { productsServices } from "@/services/products";
import { Product } from "@/types/product";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

import { motion } from "framer-motion";
import orderFn, { richPeople, sumOrders } from "@/function/orders";
import userService from "@/services/users";
import { User } from "@/types/user";
import { sumFavorties } from "@/function/product";
import { Orders } from "@/types/orders";
import Image from "next/image";
import { converPrice } from "@/utils/convertPrice";

async function fetchDatas() {
  const [orders, products, users] = await Promise.all([
    ordersService.get(),
    productsServices.get(),
    userService.get(),
  ]);
  const dataOrders = orders.data?.payload as Array<Orders>;
  const dataUsers = users.data?.payload as Array<User>;
  const dataProducts = products.data?.payload as Array<Product>;
  const dataOrdersPerYear = sumOrders(dataOrders);
  const richCustomer = richPeople(dataOrders).slice(0, 3);
  const allFvaoriteUsers = dataUsers.flatMap((user) => user.favorite);
  const totalFavortie = sumFavorties(
    allFvaoriteUsers.filter((p) => p !== undefined)
  );

  const topThree = dataProducts
    .sort((a, b) => b.soldout - a.soldout)
    .slice(0, 5);

  return {
    products: dataOrders,
    dataPerYear: dataOrdersPerYear.totalPerYear,
    dataOrderPerYear: dataOrdersPerYear.totalOrderPerYear,
    totalOrders: dataProducts,
    topThree,
    richCustomer,
    totalFavorite: totalFavortie.sort((a, b) => b.total - a.total).slice(0, 5),
    users: dataUsers,
  };
}

export default function AdminDashboardView() {
  const { data } = useSession();
  const {
    data: allData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["datas"],
    queryFn: fetchDatas,
    staleTime: 60 * 60 * 24,
  });

  if (isError) return <p>{error?.message}</p>;

  return (
    <AdminLayout>
      <section className="lg:basis-full w-full text-black pb-24">
        <TextGenerateEffect
          words={`Hello ${data?.user?.fullname} 🙌`}
          className="md:text-3xl text-2xl"
        />
        {isLoading ? (
          <section className="w-full flex items-center justify-center mt-6">
            <Loader className="text-black" />
          </section>
        ) : (
          <main className="w-full">
            <section className="w-full grid md:grid-cols-3 gap-3 mt-5">
              <article className="md:col-span-1 p-4 flex flex-col gap-3 border-2 rounded-md border-black">
                <h4 className="text-lg font-semibold">Top 3 Customer</h4>
                {allData?.richCustomer.map((people, i) => (
                  <motion.div
                    initial={{ translateY: 100, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ delay: i * 0.8 }}
                    key={people.id}
                    className="w-full flex items-center justify-between border-b-2 border-b-slate-700 py-3"
                  >
                    <figure className="flex gap-3 items-center">
                      <Image
                        src={
                          allData.users.find((user) => user.id === people.id)
                            ?.photo_profile
                            ? (allData.users.find(
                                (user) => user.id === people.id
                              )?.photo_profile as string)
                            : "/userdefault.png"
                        }
                        alt="Profile"
                        width={70}
                        height={70}
                        className="rounded-full"
                      />
                      <figcaption>
                        {
                          allData.users.find((user) => user.id === people.id)
                            ?.fullname
                        }
                      </figcaption>
                    </figure>
                    <p>{converPrice(people.total)}</p>
                  </motion.div>
                ))}
              </article>
              <div className="md:col-span-1 p-2 border-2 border-black rounded-md">
                <h1 className="text-2xl mb-4">Top 5 Products</h1>
                <Pie
                  data={{
                    labels: allData?.topThree?.map((p) => p.name_product),
                    datasets: [
                      {
                        label: "Top 3 Products",
                        data: allData?.topThree?.map((p) => p.soldout),
                        backgroundColor: [
                          "rgba(247, 214, 0, 0.78)",
                          "rgba(134, 134, 134, 0.78)",
                          "rgba(201, 113, 23, 0.78)",
                          "rgba(134, 50, 135, 0.82)",
                          "rgba(32, 205, 37, 0.82)",
                        ],
                      },
                    ],
                  }}
                />
              </div>
              <div className="md:col-span-1 p-2 border-2 border-black rounded-md">
                <h1 className="text-2xl mb-4">5 Favorite Products</h1>
                <PolarArea
                  data={{
                    labels: allData?.totalFavorite?.map(
                      (favorite) => favorite.name
                    ),
                    datasets: [
                      {
                        label: "5 Favorites Products",
                        data: allData?.totalFavorite?.map(
                          (favorite) => favorite.total
                        ),
                        backgroundColor: [
                          "rgba(247, 214, 0, 0.78)",
                          "rgba(6, 39, 172, 0.82)",
                          "rgba(255, 133, 0, 0.82)",
                          "rgba(245, 40, 145, 0.8)",
                          "rgba(80, 128, 188, 1)",
                        ],
                      },
                    ],
                  }}
                />
              </div>
            </section>

            <div className="mt-5 p-2 border-2 border-black rounded-md col-span-2">
              <h1 className="text-2xl mb-4">
                Total Revenue in {new Date().getFullYear()}
              </h1>
              <Line
                data={{
                  labels: MONTH,
                  datasets: [
                    {
                      label: "Total Revenue",
                      data: allData?.dataPerYear,
                      borderColor: "rgba(0, 204,  204, 0.6)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
            <div className="mt-5 p-2 border-2 border-black rounded-md">
              <h1 className="text-2xl mb-4">
                Total Order in {new Date().getFullYear()}
              </h1>
              <Bar
                data={{
                  labels: MONTH,
                  datasets: [
                    {
                      label: "Total Order",
                      data: allData?.dataOrderPerYear,
                      backgroundColor: "rgba(38, 233, 226, 0.78)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>
          </main>
        )}
      </section>
    </AdminLayout>
  );
}
