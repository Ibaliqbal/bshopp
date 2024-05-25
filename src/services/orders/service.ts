import {
  deleteData,
  detailData,
  retrieveData,
  setData,
  updateData,
} from "@/lib/firebase/services";
import { Orders } from "@/types/orders";
import { serverTimestamp } from "firebase/firestore";

export async function createOrder(data: any, callaback: Function) {
  data.orderAt = serverTimestamp();
  await setData(
    "orders",
    data,
    (res: boolean) => {
      if (!res)
        return callaback({ status: res, message: "Cannot create order" });
      return callaback({ status: res, message: "Order created" });
    },
    data.order_id
  );
}

export async function updateOrder(
  id: string,
  data: { status: string },
  callaback: Function
) {
  await updateData("orders", id, data, (res: boolean) => {
    if (res) {
      return callaback({ status: res, message: "Updated sueccessfuly" });
    } else {
      return callaback({ status: res, message: "Updated failed" });
    }
  });
}

export async function getOrderById(orderId: string, callback: Function) {
  await detailData(
    "orders",
    orderId,
    (result: { status: boolean; data: Orders }) => {
      if (!result.status)
        return callback({ status: result.status, data: result.data });
      return callback({ status: result.status, data: result.data });
    }
  );
}

export async function getOrders() {
  const data = await retrieveData("orders");

  if (data) {
    return data;
  } else {
    return null;
  }
}

export async function updateStatus(
  id: string,
  data: { status: string },
  callback: Function
) {
  await updateData("orders", id, data, (res: boolean) => {
    if (res) {
      callback({ status: res, message: "Updated sueccessfuly" });
    } else {
      callback({ status: res, message: "Updated failed" });
    }
  });
}

export async function deleteOrder(id: string, callback: Function) {
  await deleteData("orders", id, (res: boolean) => {
    if (res) {
      callback({ status: res, message: "Deleted sueccessfuly" });
    } else {
      callback({ status: res, message: "Deleted failed" });
    }
  });
}
