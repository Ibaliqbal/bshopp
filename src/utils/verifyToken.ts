import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
export const verify = (
  req: NextApiRequest,
  res: NextApiResponse,
  isAdmin: boolean,
  callback: Function
) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  if (token) {
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err, decode: any) => {
        if (decode) {
          if (isAdmin && decode.role !== "admin") {
            return res
              .status(403)
              .json({ status: false, message: "Access denied" });
          }
          callback(decode);
        } else {
          return res
            .status(403)
            .json({ status: false, message: "Access denied" });
        }
      }
    );
  } else {
    return res.status(403).json({ status: false, message: "Access denied" });
  }
};
