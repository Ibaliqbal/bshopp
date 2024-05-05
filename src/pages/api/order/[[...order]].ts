import { createOrder, updateOrder } from "@/services/orders/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    await createOrder(data, (result: { status: boolean; message: string }) => {
      if (result.status) {
        res.status(200).json({
          status: result.status,
          message: result.message,
        });
      } else {
        res.status(500).json({
          status: result.status,
          message: result.message,
        });
      }
    });
  } else if (req.method === "PUT") {
    const query = req.query.order;
    const data = req.body;
    if (query) {
      await updateOrder(
        query[0],
        data,
        (result: { status: boolean; message: string }) => {
          if (result.status) {
            res.status(200).json({
              status: result.status,
              message: result.message,
            });
          } else {
            res
              .status(500)
              .json({ status: result.status, message: result.message });
          }
        }
      );
    }
  } else {
    res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}
