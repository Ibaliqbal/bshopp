import NextAuth, { DefaultSesssion } from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      fullname: string;
      role: string;
      type: string;
      image: string;
    };
    accessToken: string;
  }
  DefaultSesssion["user"];
}
