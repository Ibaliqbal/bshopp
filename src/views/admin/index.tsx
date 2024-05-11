import AdminLayout from "@/components/layouts/AdminLayout";
import TextGenerateEffect from "@/components/ui/text-generate-effect";
import { useSession } from "next-auth/react";
import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
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
} from "chart.js";
import { ordersService } from "@/services/orders";
import { Orders } from "@/types/orders";
import { getMonth, getYear } from "date-fns";
import { MONTH } from "@/constant";
import { ChcekoutCart } from "@/types/checkout";
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
  ArcElement
);
import { motion } from "framer-motion";

function sumOrders(data: Array<Orders>) {
  const thisYear = new Date().getFullYear();
  const filteredOrders = data.filter(
    (check) => getYear(new Date(check.orderAt.seconds * 1000)) === thisYear
  );

  const mappingPerMonth = filteredOrders.reduce((acc: any, curr: Orders) => {
    const found = acc.find(
      (c: any) =>
        c.month === MONTH[getMonth(new Date(curr.orderAt.seconds * 1000))]
    );

    if (found) {
      found.total += curr.cart.reduce((acc: number, curr: ChcekoutCart) => {
        return acc + curr.qty * curr.price;
      }, 0);
    } else {
      acc.push({
        month: MONTH[getMonth(new Date(curr.orderAt.seconds * 1000))],
        total: curr.cart.reduce((acc: number, curr: ChcekoutCart) => {
          return acc + curr.qty * curr.price;
        }, 0),
      });
    }
    return acc;
  }, []);
  const mappingOrderPerMonth = filteredOrders.reduce(
    (acc: any, curr: Orders) => {
      const found = acc.find(
        (c: any) =>
          c.month === MONTH[getMonth(new Date(curr.orderAt.seconds * 1000))]
      );

      if (found) {
        found.total += 1;
      } else {
        acc.push({
          month: MONTH[getMonth(new Date(curr.orderAt.seconds * 1000))],
          total: 1,
        });
      }
      return acc;
    },
    []
  );

  const mappingPerYear = MONTH.map((m) => {
    const found = mappingPerMonth.find(
      (c: { month: string; total: number }) => c.month === m
    );
    if (found) {
      return found.total;
    } else {
      return 0;
    }
  });
  const mappingOrderPerYear = MONTH.map((m) => {
    const found = mappingOrderPerMonth.find(
      (c: { month: string; total: number }) => c.month === m
    );
    if (found) {
      return found.total;
    } else {
      return 0;
    }
  });
  return {
    totalPerYear: mappingPerYear,
    totalOrderPerYear: mappingOrderPerYear,
  };
}
async function fetchOrders() {
  const response = await ordersService.get();
  const data = response.data.payload as Array<Orders>;

  const dataOrdersPerYear = sumOrders(data);

  return {
    payload: data,
    dataPerYear: dataOrdersPerYear.totalPerYear,
    dataOrderPerYear: dataOrdersPerYear.totalOrderPerYear,
  };
}

async function fetchProducts() {
  const response = await productsServices.get();
  const data = response.data.payload as Array<Product>;
  const topThree = data.sort((a, b) => b.soldout - a.soldout);

  return { totalData: data, topThree: topThree.slice(0, 3) };
}

export default function AdminDashboardView() {
  const { data } = useSession();
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 60 * 60 * 24,
  });
  const {
    data: products,
    error: errorProduct,
    isError: isErrorProducts,
    isLoading: isLoadingProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 60 * 60 * 24,
  });

  if (isError || isErrorProducts)
    return <p>{error?.message || errorProduct?.message}</p>;

  return (
    <AdminLayout>
      <section className="lg:basis-full text-black pb-24">
        <TextGenerateEffect
          words={`Hello ${data?.user?.name} 🙌`}
          className="md:text-3xl text-2xl"
        />
        {isLoading || isLoadingProducts ? (
          <section className="w-full flex items-center justify-center mt-6">
            <Loader className="text-black" />
          </section>
        ) : (
          <>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1, transformOrigin: "bottom" }}
              transition={{
                delay: 1,
                duration: 0.6,
                ease: "circInOut",
                type: "spring",
              }}
              className="mt-5 p-2 border-2 border-black rounded-md"
            >
              <h1 className="text-2xl">Total Revenue</h1>
              <Line
                data={{
                  labels: MONTH,
                  datasets: [
                    {
                      label: "Total Revenue",
                      data: orders?.dataPerYear,
                      borderColor: "rgba(0, 204,  204, 0.6)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </motion.div>
            <div className="md:grid grid-cols-3 gap-5">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1, transformOrigin: "left" }}
                transition={{
                  delay: 2,
                  duration: 0.7,
                  ease: "circInOut",
                  type: "spring",
                }}
                className="mt-5 md:col-span-2 p-2 border-2 border-black rounded-md"
              >
                <h1 className="text-2xl">Total Order</h1>
                <Bar
                  data={{
                    labels: MONTH,
                    datasets: [
                      {
                        label: "Total Order",
                        data: orders?.dataOrderPerYear,
                        backgroundColor: "rgba(38, 233, 226, 0.78)",
                      },
                    ],
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1, transformOrigin: "right" }}
                transition={{
                  delay: 3,
                  duration: 0.8,
                  ease: "circInOut",
                  type: "spring",
                }}
                className="mt-5 md:col-span-1 p-2 border-2 border-black rounded-md"
              >
                <h1 className="text-2xl">Top 3 Products</h1>
                <Pie
                  data={{
                    labels: products?.topThree.map((p) => p.name_product),
                    datasets: [
                      {
                        label: "Top 3 Products",
                        data: products?.topThree.map((p) => p.soldout),
                        backgroundColor: [
                          "rgba(247, 214, 0, 0.78)",
                          "rgba(134, 134, 134, 0.78)",
                          "rgba(201, 113, 23, 0.78)",
                        ],
                      },
                    ],
                  }}
                />
              </motion.div>
            </div>
          </>
        )}
      </section>
    </AdminLayout>
  );
}
