import { MONTH } from "@/constant";
import { CheckoutCart } from "@/types/checkout";
import { Orders } from "@/types/orders";
import { getMonth, getYear } from "date-fns";

class OrderFn {
  sumOrders(data: Array<Orders>) {
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
        found.total += curr.cart.reduce((acc: number, curr: CheckoutCart) => {
          return acc + curr.qty * curr.price;
        }, 0);
      } else {
        acc.push({
          month: MONTH[getMonth(new Date(curr.orderAt.seconds * 1000))],
          total: curr.cart.reduce((acc: number, curr: CheckoutCart) => {
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

  richPeople(orders: Array<Orders>) {
    const richPeople = orders.reduce(
      (
        acc: Array<{
          id: string;
          total: number;
        }>,
        curr
      ) => {
        const findSameeUser = acc.find((user) => user.id === curr.id);
        if (findSameeUser) {
          findSameeUser.total += curr.cart.reduce(
            (acc: number, curr: CheckoutCart) => {
              return acc + curr.qty * curr.price;
            },
            0
          );
        } else {
          acc.push({
            id: curr?.id as string,
            total: curr.cart.reduce((acc: number, curr: CheckoutCart) => {
              return acc + curr.qty * curr.price;
            }, 0),
          });
        }
        return acc;
      },
      []
    );

    return richPeople;
  }
}

const orderFn = new OrderFn();

export default orderFn;

export function sumOrders(data: Array<Orders>) {
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
      found.total += curr.cart.reduce((acc: number, curr: CheckoutCart) => {
        return acc + curr.qty * curr.price;
      }, 0);
    } else {
      acc.push({
        month: MONTH[getMonth(new Date(curr.orderAt.seconds * 1000))],
        total: curr.cart.reduce((acc: number, curr: CheckoutCart) => {
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

export function richPeople(orders: Array<Orders>) {
  const richPeople = orders
    .filter((order) => order.status === "PAID")
    .reduce(
      (
        acc: Array<{
          id: string;
          total: number;
        }>,
        curr
      ) => {
        const findSameeUser = acc.find((user) => user.id === curr.id);
        if (findSameeUser) {
          findSameeUser.total += curr.cart.reduce(
            (acc: number, curr: CheckoutCart) => {
              return acc + curr.qty * curr.price;
            },
            0
          );
        } else {
          acc.push({
            id: curr?.id as string,
            total: curr.cart.reduce((acc: number, curr: CheckoutCart) => {
              return acc + curr.qty * curr.price;
            }, 0),
          });
        }
        return acc;
      },
      []
    );

  return richPeople;
}
