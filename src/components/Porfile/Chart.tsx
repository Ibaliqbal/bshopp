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
        (c: any) =>
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

const Chart = () => {
  const user: User = useUser();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [dataYear, setDataYear] = React.useState<any[]>([]);
  const thisYear = new Date().getFullYear();
  const getOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await checkoutService.get(user?.id || "");
      const data = res.data.payload;
      const filteredData = sumChcekout(data, thisYear);
      setData(data);
      setDataYear(filteredData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getOrders();
  }, [user]);
  return loading ? (
    <section className="flex items-center justify-center mt-6">
      <Loader className="text-black" />
    </section>
  ) : (
    <section className="mt-5 md:h-2/6 h-1/4">
      <div className="mb-10 flex items-center justify-between">
        <h1>Chart</h1>
        <Select
          options={[
            {
              label: thisYear - 2,
              value: thisYear - 2,
            },
            {
              label: thisYear - 1,
              value: thisYear - 1,
            },
            {
              label: thisYear,
              value: thisYear,
            },
          ]}
          defaultValue={{
            label: thisYear,
            value: thisYear,
          }}
          onChange={(option: SingleValue<{ label: number; value: number }>) => {
            const sum = sumChcekout(data, option?.value as number);
            setDataYear(sum);
          }}
        />
      </div>
      <Bar
        data={{
          labels: MONTH,
          datasets: [
            {
              label: "Checkout",
              data: dataYear,
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
