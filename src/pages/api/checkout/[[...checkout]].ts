const midtransClient = require("midtrans-client");
import { firestore } from "@/lib/firebase/services";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

let snap = new midtransClient.Snap({
  isProducttion: false,
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
        order_id: uuidv4(),
      },
      customer_details: {
        first_name: user.data().fullname,
        email: user.data().email,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/profile/order`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/profile/order`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/profile/order`,
      },
    };

    const token = await snap.createTransactionToken(parameter);
    res.status(200).json({
      status: true,
      message: "Success jon",
      token,
    });
  }
}
