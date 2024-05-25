import { useUser } from "@/context/user/user.context";
import { checkoutService } from "@/services/checkout";
import { User } from "@/types/user";
import { getMonth, getYear } from "date-fns";
import * as React from "react";
import Loader from "../ui/loader";
import { MONTH } from "@/constant";
import {
  Chart as ChartJs,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Select, { SingleValue } from "react-select";
import { TCheckout } from "@/types/checkout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

ChartJs.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale
);

function sumChcekout(data: Array<TCheckout>, thisYear: number) {
  let filteredData = data.filter(
    (check: TCheckout) =>
      getYear(new Date(check.checkoutAt.seconds * 1000)) === thisYear
  );
  const mappingPerMonth = filteredData.reduce(
    (
      acc: Array<{
        month: string;
        total: number;
      }>,
      curr: TCheckout
    ) => {
      const found = acc.find(
        (c: { month: string; total: number }) =>
          c.month === MONTH[getMonth(new Date(curr.checkoutAt.seconds * 1000))]
      );
      if (found) {
        found.total += curr.gross_amount;
      } else {
        acc.push({
          month: MONTH[getMonth(new Date(curr.checkoutAt.seconds * 1000))],
          total: curr.gross_amount,
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
  return mappingPerYear;
}

async function fetchCheckout(id: string, year: number) {
  if (!id) return [];
  const res = await checkoutService.get(id);
  const data = res.data.payload;
  const filteredData = sumChcekout(data, year);

  return filteredData;
}

const Chart = () => {
  const thisYear = new Date().getFullYear();
  const user: User = useUser();
  const queryClient = useQueryClient();
  const [year, setYear] = React.useState<
    SingleValue<{
      value: number;
      label: string;
    }>
  >({
    value: new Date().getFullYear(),
    label: new Date().getFullYear().toString(),
  });
  const { data: checkout, isLoading } = useQuery({
    queryKey: ["chart-checkout"],
    queryFn: () => fetchCheckout(user?.id, year?.value ?? 0),
    enabled: !!user,
  });
  const { mutate: changeYear } = useMutation({
    mutationFn: (year: number) => fetchCheckout(user?.id, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chart-checkout"] });
    },
  });

  return isLoading ? (
    <section className="w-full flex items-center justify-center mt-6 h-full">
      <Loader className="text-black" />
    </section>
  ) : (
    <section className="mt-5">
      <div className="mb-10 flex items-center justify-between">
        <h1>Your spending</h1>
        <Select
          id="year"
          instanceId={"year"}
          options={[
            {
              label: (thisYear - 2).toString(),
              value: thisYear - 2,
            },
            {
              label: (thisYear - 1).toString(),
              value: thisYear - 1,
            },
            {
              label: thisYear.toString(),
              value: thisYear,
            },
          ]}
          defaultValue={{
            label: thisYear.toString(),
            value: thisYear,
          }}
          onChange={(option: SingleValue<{ label: string; value: number }>) => {
            setYear(option);
            changeYear(option?.value as number);
          }}
        />
      </div>
      <Bar
        data={{
          labels: MONTH,
          datasets: [
            {
              label: "Checkout",
              data: checkout,
              backgroundColor: "rgba(0, 204,  204, 0.6)",
              borderRadius: 4,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              text: "Total",
            },
          },
          responsive: true,
        }}
      />
    </section>
  );
};

export default Chart;
