import { setData } from "@/lib/firebase/services";

export async function createOrder(data: any, callaback: Function) {
  await setData("orders", data, (res: boolean) => {
    if (!res) return callaback({ status: res, message: "Cannot create order" });
    return callaback({ status: res, message: "Order created" });
  });
}
