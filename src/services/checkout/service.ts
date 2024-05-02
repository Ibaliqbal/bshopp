import { setData } from "@/lib/firebase/services";

export async function createCheckout(data: any, callback: Function) {
  await setData("checkouts", data, (res: boolean) => {
    if (!res) return callback({ status: res, message: "Wrong id product" });
    return callback({ status: res, message: "Checkout successfully" });
  });
}
