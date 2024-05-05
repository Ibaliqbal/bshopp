import { detailData, setData, updateData } from "@/lib/firebase/services";
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

export async function updateOrder(id: string, data: any, callaback: Function) {
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
    (result: { status: boolean; data: any }) => {
      if (!result.status)
        return callback({ status: result.status, data: result.data });
      return callback({ status: result.status, data: result.data });
    }
  );
}
