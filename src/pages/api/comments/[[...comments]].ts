import {
  createComments,
  getCommentByProduct,
} from "@/services/comments/method";
import { verify } from "@/utils/verifyToken";
import { serverTimestamp } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;

    verify(req, res, false, async () => {
      if (data) {
        await createComments(
          { ...data, comment_at: serverTimestamp() },
          ({ status, message }: { status: boolean; message: string }) => {
            if (status)
              return res.status(200).json({ status, message, statusCode: 200 });
            return res.status(400).json({ status, message, statusCode: 400 });
          }
        );
      }
    });
  } else if (req.method === "GET") {
    const query = req.query.comments;
    if (query) {
      const result = await getCommentByProduct(query[0]);

      if (result) {
        return res.status(200).json({
          status: true,
          message: "Success",
          payload: result,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Failed",
          payload: [],
        });
      }
    }
  } else {
    res.status(500).json({
      status: false,
      message: "Method Not Allowed",
    });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
