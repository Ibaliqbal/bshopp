const midtransClient = require("midtrans-client");
import { firestore } from "@/lib/firebase/services";
import {
  createCheckout,
  deleteCheckout,
  filterOrder,
  getCheckoutById,
  getUserOrders,
  TStatus,
  updateCheckout,
  updateStatus,
} from "@/services/checkout/service";
import { TCheckout } from "@/types/checkout";
import { verify } from "@/utils/verifyToken";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const user = await getDoc(doc(firestore, "users", req.body?.id));
    const data = req.body;
    const order_id = uuidv4();
    const id = data?.id;
    const cart = data?.cart;
    const gross_amount = cart.reduce(
      (acc: number, curr: any) => acc + curr.qty * curr.price,
      0
    );

    if (!user.exists())
      return res.status(200).json({ status: false, message: "User not found" });

    let parameter = {
      item_details: cart.map((item: any) => ({
        id: item.id,
        price: item.price,
        quantity: Number(item.qty),
        name: item.name,
        category: item.category,
      })),
      transaction_details: {
        gross_amount: Number(gross_amount),
        order_id,
      },
      customer_details: {
        first_name: user.data().fullname,
        email: user.data().email,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/success-order`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/profile/order`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/profile/order`,
      },
    };

    const token = await snap.createTransactionToken(parameter);

    await createCheckout(
      {
        order_id,
        user_id: id,
        token: token,
        cart: cart,
        gross_amount: gross_amount,
        status: "PENDING",
      },
      (result: { status: boolean; message: string }) => {
        if (!result.status)
          return res.status(400).json({
            status: result.status,
            message: result.message,
          });
        return res.status(200).json({
          status: result.status,
          message: result.message,
          order_id,
          token,
        });
      },
      order_id
    );
  } else if (req.method === "PUT") {
    const query = req.query.checkout;
    const data = req.body;
    verify(req, res, false, async () => {
      if (!query || !data) {
        return res
          .status(400)
          .json({ status: false, message: "Missing parameters" });
      }
      await updateCheckout(
        query[0],
        data,
        (result: { status: boolean; message: string }) => {
          if (!result.status)
            return res
              .status(400)
              .json({ status: result.status, message: result.message });
          return res
            .status(200)
            .json({ status: result.status, message: result.message });
        }
      );
    });
  } else if (req.method === "GET") {
    const query = req.query.checkout;
    const status = req.query.status;
    const user_id = req.query.user_id;
    verify(req, res, false, async () => {
      if (!query) {
        if (!user_id)
          return res
            .status(400)
            .json({ status: false, message: "Missing parameters" });

        if (status) {
          const checkout = await filterOrder(
            user_id as string,
            status as TStatus
          );
          res.status(200).json({
            status: true,
            message: `Successfully filtered ${status}`,
            payload: checkout,
          });
        } else {
          const checkout = await getUserOrders(user_id as string);
          res.status(200).json({
            status: true,
            message: "Successfully",
            payload: checkout,
          });
        }
      } else {
        await getCheckoutById(
          query[0] as string,
          ({
            status,
            message,
            data,
          }: {
            status: boolean;
            message: string;
            data: TCheckout;
          }) => {
            if (status) {
              return res.status(200).json({ status, message, payload: data });
            } else {
              return res.status(404).json({ status, message, payload: data });
            }
          }
        );
      }
    });
  } else if (req.method === "DELETE") {
    const query = req.query.checkout;
    verify(req, res, false, async () => {
      if (!query) {
        return res
          .status(400)
          .json({ status: false, message: "Missing parameters" });
      }
      await deleteCheckout(
        query[0],
        ({ status, message }: { status: boolean; message: string }) => {
          if (status) {
            return res.status(200).json({ status, message });
          } else {
            return res.status(404).json({ status, message });
          }
        }
      );
    });
  } else if (req.method === "PATCH") {
    const query = req.query.checkout;
    const data = req.body;

    verify(req, res, false, async () => {
      if (query) {
        await updateStatus(
          query[0],
          data,
          ({ status, message }: { status: boolean; message: string }) => {
            if (status) {
              return res.status(200).json({ status, message });
            } else {
              return res.status(404).json({ status, message });
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Missing parameters" });
      }
    });
  } else {
    res.status(403).json({ status: false, message: "Method not allowed" });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
