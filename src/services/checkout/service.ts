import {
  retrieveDataByField,
  setData,
  updateData,
} from "@/lib/firebase/services";
import { serverTimestamp, where } from "firebase/firestore";

export type TStatus = "PAID" | "PENDING" | "CANCELED";

export async function createCheckout(
  data: any,
  callback: Function,
  id: string
) {
  data.checkoutAt = serverTimestamp();
  await setData(
    "checkouts",
    data,
    (res: boolean) => {
      if (!res) return callback({ status: res, message: "Wrong id product" });
      return callback({ status: res, message: "Checkout successfully" });
    },
    id
  );
}

export async function updateCheckout(
  id: string,
  data: any,
  callback: Function
) {
  await updateData("checkouts", id, data, (res: boolean) => {
    if (!res) return callback({ status: res, message: "Wrong id checkout" });
    return callback({ status: res, message: "Checkout updated" });
  });
}

export async function getUserOrders(id: string) {
  const result = await retrieveDataByField("checkouts", [
    where("user_id", "==", id),
  ]);

  if (result) {
    return result;
  } else {
    return null;
  }
}

export async function filterOrder(id: string, status: TStatus) {
  const result = await retrieveDataByField("checkouts", [
    where("user_id", "==", id),
    where("status", "==", status),
  ]);

  if (result) {
    return result;
  } else {
    return null;
  }
}
