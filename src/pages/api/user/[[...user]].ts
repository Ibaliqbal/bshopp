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
import { compare } from "bcrypt";
import bcrypt from "bcrypt";
import { verify } from "@/utils/verifyToken";

type Data = {
  status: boolean;
  message: string;
  payload?: any;
  statusCode?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const email = req.query._email;
    const q = req.query.user;
    verify(req, res, false, async () => {
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
    });
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
    verify(req, res, false, async () => {
      if (!query || !data) {
        return res
          .status(400)
          .json({ status: false, message: "Missing parameters" });
      }
      if (query[1] === "reset") {
        const isSame = await compare(data.old, data.pw);
        const newPassword = await bcrypt.hash(data.new, 10);
        if (!isSame)
          return res.status(200).json({
            status: false,
            statusCode: 417,
            message: "Password is incorrect",
          });
        await updateUser(
          query[0],
          { password: newPassword },
          (result: { status: boolean; message: string }) => {
            if (result.status) {
              return res.status(200).json({
                status: true,
                statusCode: 200,
                message: result.message,
              });
            } else {
              return res.status(200).json({
                status: false,
                statusCode: 400,
                message: result.message,
              });
            }
          }
        );
      } else {
        await updateUser(
          query[0],
          data,
          (result: { status: boolean; message: string }) => {
            if (result.status) {
              return res.status(200).json({
                status: true,
                statusCode: 200,
                message: result.message,
              });
            } else {
              return res.status(200).json({
                status: false,
                statusCode: 400,
                message: result.message,
              });
            }
          }
        );
      }
    });
  } else if (req.method === "DELETE") {
    const query = req.query.user;
    verify(req, res, true, async () => {
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
