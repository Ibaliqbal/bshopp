// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { singUp } from "@/services/auth/service";
import {
  deleteUser,
  detailUser,
  detailUserByEmail,
  getUsers,
  updateUser,
} from "@/services/users/service";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type Data = {
  status: boolean;
  message: string;
  payload?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const email = req.query._email;
    const q = req.query.user;
    if (q) {
      const user = await detailUser(q[0] as string);
      if (user) {
        return res
          .status(200)
          .json({ status: true, message: "Successfuly", payload: user });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "User not found", payload: {} });
      }
    }
    if (email) {
      const user = await detailUserByEmail(email as string);
      if (user) {
        return res
          .status(200)
          .json({ status: true, message: "Successfuly", payload: user });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "User not found", payload: {} });
      }
    }
    const users = await getUsers();
    if (users) {
      res
        .status(200)
        .json({ status: true, message: "Successfully", payload: users });
    } else {
      res.status(400).json({ status: false, message: "No data" });
    }
  } else if (req.method === "POST") {
    const query = req.query.user;
    const data = req.body;
    if (query) {
      if (query[0] === "register") {
        await singUp(data, (result: { status: boolean; message: string }) => {
          if (result.status) {
            return res
              .status(201)
              .json({ status: result.status, message: result.message });
          } else {
            return res
              .status(200)
              .json({ status: result.status, message: result.message });
          }
        });
      }
    }
  } else if (req.method === "PUT") {
    const query = req.query.user;
    const data = req.body;
    if (!query || !data) {
      return res
        .status(400)
        .json({ status: false, message: "Missing parameters" });
    }
    await updateUser(
      query[0],
      data,
      (result: { status: boolean; message: string }) => {
        if (result.status) {
          return res
            .status(200)
            .json({ status: true, message: result.message });
        } else {
          return res
            .status(400)
            .json({ status: false, message: result.message });
        }
      }
    );
  } else if (req.method === "DELETE") {
    const query = req.query.user;
    const token = req.headers.authorization?.split(" ")[1] || "";
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err, decode: any) => {
        if (decode && decode.role === "admin") {
          await deleteUser(
            query![0],
            (response: { status: boolean; message: string }) => {
              if (!response.status)
                res
                  .status(400)
                  .json({ status: response.status, message: response.message });

              res
                .status(200)
                .json({ status: response.status, message: response.message });
            }
          );
        } else {
          return res
            .status(403)
            .json({ status: false, message: "Access denied" });
        }
      }
    );
  } else {
    res.status(403).json({ status: false, message: "Method not allowed" });
  }
}
