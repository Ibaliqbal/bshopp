import Link from "next/link";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  error: string;
  type: "login" | "register";
  linkText: string;
};

const AuthLayout = ({ error, children, type, linkText }: AuthLayoutProps) => {
  return (
    <section className="lg:w-[30%]">
      <div className="p-10 flex justify-center items-center gap-4 flex-col shadow-lg shadow-black w-full">
        <motion.h1
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backInOut" }}
          className="font-bold lg:text-3xl text-2xl"
        >
          {type === "login" ? "Welcome Back" : "Hello, welcome to BShopp"}
        </motion.h1>
        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}
        {children}
        <p className="font-bold mt-3">
          {linkText}
          <Link
            href={`/auth/${type === "login" ? "register" : "login"}`}
            className="text-blue-600"
          >
            here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AuthLayout;
