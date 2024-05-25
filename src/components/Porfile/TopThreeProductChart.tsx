import { useUser } from "@/context/user/user.context";
import { checkoutService } from "@/services/checkout";
import { TCheckout } from "@/types/checkout";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getYear } from "date-fns";
import React, { useEffect, useState } from "react";
import { CheckoutCart } from "../../types/checkout";
import Loader from "../ui/loader";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import Image from "next/image";
import Link from "next/link";

ChartJs.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function sumCheckout(data: Array<TCheckout>) {
  const filteredData = data.filter(
    (check: TCheckout) =>
      getYear(new Date(check.checkoutAt.seconds * 1000)) ===
      new Date().getFullYear()
  );
  const mapCart = filteredData
    .map((check) => check.cart)
    .flatMap((check) => check);
  const reduceCheckout = mapCart.reduce(
    (
      acc: Array<{ name: string; variant: string; total: number }>,
      curr: CheckoutCart
    ) => {
      const found = acc.find(
        (c) => c.name === curr.name && c.variant === curr.variant
      );
      if (found) {
        found.total += curr.qty;
      } else {
        acc.push({
          name: curr.name,
          variant: curr.variant,
          total: curr.qty,
        });
      }
      return acc;
    },
    []
  );
  return reduceCheckout.sort((a, b) => b.total - a.total).slice(0, 5);
}

async function fetchCheckout(id: string) {
  if (!id) return [];
  const res = await checkoutService.get(id);
  const data = res.data.payload;
  const filtered = sumCheckout(data);

  return filtered;
}

const TopThreeProductChart = () => {
  const user: User = useUser();
  const { data: checkout, isLoading } = useQuery({
    queryKey: ["topThreeProductChart"],
    queryFn: () => fetchCheckout(user?.id),
    enabled: !!user,
  });

  return isLoading ? (
    <section className="w-full flex items-center justify-center mt-6 h-full">
      <Loader className="text-black" />
    </section>
  ) : (
    <section className="mt-5 h-full">
      <h1 className="mb-10">Top 5 product often to buy</h1>
      {checkout && checkout?.length > 0 ? (
        <Pie
          data={{
            labels: checkout?.map((c) => c.name),
            datasets: [
              {
                label: "Top 5 Products",
                data: checkout?.map((c) => c.total),
                backgroundColor: [
                  "rgba(247, 214, 0, 0.78)",
                  "rgba(134, 134, 134, 0.78)",
                  "rgba(201, 113, 23, 0.78)",
                  "rgba(233, 33, 44, 0.88)",
                  "rgba(210, 20, 51, 0.66)",
                ],
              },
            ],
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-4 flex-col">
          <Image
            src={"/order.svg"}
            alt="no-cart"
            width={200}
            height={200}
            priority
          />
          <h3 className="font-semibold text-lg">
            No order, checkout products{" "}
            <Link href={"/products"} className="text-blue-600">
              now!
            </Link>
          </h3>
        </div>
      )}
    </section>
  );
};

export default TopThreeProductChart;
