import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import { serverTimestamp } from "firebase/firestore";
import { loginWithGoogle, signIn } from "@/services/auth/service";
import jwt from "jsonwebtoken";

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user: any = await signIn({ email });
        if (user) {
          const passwordConfirm = await compare(password, user.password);
          if (passwordConfirm) return user;
          return null;
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_AUTH_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_AUTH_GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account?.provider === "credentials") {
        token.email = user.email;
        token.fullname = user.fullname;
        token.phone = user.phone;
        token.role = user.role;
        token.type = "credentials";
        token.photo_profile = user.photo_profile;
      }
      if (account?.provider === "google") {
        const data = {
          fullname: user.name,
          email: user.email,
          photo_profile: user.image,
          type: "google",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await loginWithGoogle(data, (result: any) => {
          token.email = result.email;
          token.fullname = result.fullname;
          token.image = result.image;
          token.role = result.role;
          token.photo_profile = result.photo_profile;
        });
      }
      return token;
    },
    async session({ session, token }: any) {
      if ("emial" in token) {
        session.user.email = token.email;
      }
      if ("fullname" in token) {
        session.user.fullname = token.fullname;
      }
      if ("role" in token) {
        session.user.role = token.role;
      }

      if ("type" in token) {
        session.user.type = token.type;
      }

      if ("photo_profile" in token) {
        session.user.image = token.photo_profile;
      }

      const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
        algorithm: "HS256",
      });

      session.accessToken = accessToken;
      //   session.accessToken = token.accessToken;
      //   session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
