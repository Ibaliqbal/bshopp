import {
  deleteData,
  detailData,
  retrieveDataByField,
  setData,
  updateData,
} from "@/lib/firebase/services";
import {
  DocumentData,
  serverTimestamp,
  where,
  WithFieldValue,
} from "firebase/firestore";

export type TStatus = "PAID" | "PENDING" | "CANCELED";

export async function createCheckout(
  data: WithFieldValue<DocumentData>,
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
  data: WithFieldValue<DocumentData>,
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

export async function getCheckoutById(id: string, callback: Function) {
  await detailData(
    "checkouts",
    id,
    ({ status, data }: { status: boolean; data: any }) => {
      if (status) {
        callback({ status: true, message: "Successfully data found", data });
      } else {
        callback({ status: false, message: "Data not found", data });
      }
    }
  );
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

export async function deleteCheckout(id: string, callback: Function) {
  await deleteData("checkouts", id, (status: boolean) => {
    if (!status)
      return callback({ status: status, message: "Wrong id checkout" });
    return callback({ status: status, message: "Checkout deleted" });
  });
}

export async function updateStatus(
  id: string,
  data: { status: string },
  callback: Function
) {
  await updateData("checkouts", id, data, (res: boolean) => {
    if (!res) return callback({ status: res, message: "Wrong id checkout" });
    return callback({ status: res, message: "Checkout updated" });
  });
}
