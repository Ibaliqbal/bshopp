import { useCart } from "@/context/cart/cart.context";
import { useFavorite } from "@/context/favorite/favorite.context";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Hamburger from "@/components/ui/hamburger";
import { Session } from "next-auth";

export default function NavResponsive({
  lists,
  data,
}: {
  lists: {
    href: string;
    name: string;
  }[];
  data: Session | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fav = useFavorite();
  const cart = useCart();

  const variants = {
    open: {
      translateY: data?.user?.role !== "admin" ? 200 : 97,
      opacity: 1,
      transformOrigin: "top",
      transition: {
        duration: 0.5,
        delayChildren: 0.4,
        type: "spring",
        staggerChildren: 0.07,
      },
    },
    closed: {
      translateY: data?.user?.role !== "admin" ? -180 : -75,
      opacity: 0,
      transformOrigin: "top",
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        delayChildren: 0.03,
        duration: 0.5,
        type: "spring",
        delay: 0.4,
      },
    },
  };

  const listVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 20,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };
  return data ? (
    <>
      <Hamburger
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width={40}
        height={40}
        color="white"
        strokeWidth={80}
      />
      {data?.user?.role !== "admin" ? (
        <motion.nav
          className={`absolute flex flex-col shadow-lg bg-black  shadow-slate-600 py-4 px-5 pt-5 text-nowrap lg:items-center gap-5 w-full
          `}
          variants={variants}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.div variants={listVariants} className="flex flex-col gap-2">
            <h4 className="text-gray-300 underline decoration-gray-300 underline-offset-4 decoration-2">
              NAVIGATIONS
            </h4>
            {lists.map((list, i) => (
              <Link
                href={list.href}
                key={i}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {list.name}
              </Link>
            ))}
          </motion.div>
          <motion.div variants={listVariants} className="flex flex-col gap-2">
            <h4 className="text-gray-300 underline decoration-gray-300 underline-offset-4 decoration-2">
              SETTINGS
            </h4>
            <p>
              <Link
                href={"/profile"}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                Profile
              </Link>
            </p>
            <p
              onClick={() => {
                signOut();
                setIsOpen((prev) => !prev);
              }}
              className="cursor-pointer"
            >
              Logout
            </p>
          </motion.div>
          <motion.div variants={listVariants} className="flex flex-col gap-4">
            <h4 className="text-gray-300 underline decoration-gray-300 underline-offset-4 decoration-2">
              MORE
            </h4>
            <div className="flex items-center gap-6">
              <Link
                href={"/profile/cart"}
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative"
              >
                <i className="bx bx-cart text-3xl" />
                {cart?.length || 0 > 0 ? (
                  <span className="w-6 h-6 text-center rounded-full bg-red-500 absolute left-4">
                    {cart?.length}
                  </span>
                ) : null}
              </Link>
              <Link
                href={"/profile/favorite"}
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative"
              >
                <i className="bx bx-heart text-3xl" />
                {fav?.length || 0 > 0 ? (
                  <span className="w-6 h-6 text-center rounded-full bg-red-500 absolute left-4">
                    {fav?.length}
                  </span>
                ) : null}
              </Link>
            </div>
          </motion.div>
        </motion.nav>
      ) : (
        <motion.nav
          className={`absolute flex flex-col shadow-lg bg-black  shadow-slate-600 py-4 px-5 pt-5 text-nowrap lg:items-center gap-5 w-full
        `}
          variants={variants}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.div variants={listVariants} className="flex flex-col gap-2">
            <h4 className="text-gray-300 underline decoration-gray-300 underline-offset-4 decoration-2">
              NAVIGATIONS
            </h4>
            {lists.map((list, i) => (
              <Link
                href={list.href}
                key={i}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {list.name}
              </Link>
            ))}
          </motion.div>
        </motion.nav>
      )}
    </>
  ) : (
    <button
      className="bg-white rounded-md text-black text-lg px-4 py-2"
      onClick={() => signIn()}
    >
      Login
    </button>
  );
}
