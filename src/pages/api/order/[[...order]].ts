import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
  updateStatus,
} from "@/services/orders/service";
import { Orders } from "@/types/orders";
import { verify } from "@/utils/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    verify(req, res, false, async () => {
      await createOrder(
        data,
        (result: { status: boolean; message: string }) => {
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
        }
      );
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
  } else if (req.method === "GET") {
    const query = req.query.order;
    verify(req, res, false, async () => {
      if (!query) {
        const data = await getOrders();
        if (data) {
          return res.status(200).json({
            status: true,
            message: "Successfully",
            payload: data,
            statusCode: 200,
          });
        } else {
          return res.status(400).json({
            status: false,
            statusCode: 400,
            payload: [],
            message: "Get orders failed",
          });
        }
      } else {
        await getOrderById(
          query[0],
          ({ status, data }: { status: boolean; data: Orders }) => {
            if (status) {
              return res.status(200).json({
                status: true,
                message: "Successfully",
                payload: data,
                statusCode: 200,
              });
            } else {
              return res.status(400).json({
                status: false,
                statusCode: 400,
                payload: [],
                message: "Get orders failed",
              });
            }
          }
        );
      }
    });
  } else if (req.method === "PATCH") {
    const query = req.query.order;
    const data = req.body;
    verify(req, res, false, async () => {
      if (query) {
        await updateStatus(
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
    });
  } else if (req.method === "DELETE") {
    const query = req.query.order;

    verify(req, res, false, async () => {
      if (query) {
        await deleteOrder(
          query[0],
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
      } else {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Missing parameters.",
        });
      }
    });
  } else {
    res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
