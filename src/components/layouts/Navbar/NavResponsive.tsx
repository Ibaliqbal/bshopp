import { useCart } from "@/context/cart/cart.context";
import { useFavorite } from "@/context/favorite/favorite.context";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function NavResponsive({
  lists,
}: {
  lists: {
    href: string;
    name: string;
  }[];
}) {
  const { data }: any = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fav = useFavorite();
  const cart = useCart();
  return data ? (
    <>
      <button
        className="border-white border-2 px-4 py-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <i className="bx bx-align-right text-xl" />
      </button>
      <nav
        className={`absolute flex flex-col shadow-lg bg-black  shadow-slate-600 py-4 px-5 pt-5 transition-all text-nowrap duration-200 ease-linear lg:items-center gap-5 w-full ${
          isOpen ? "top-full z-50 rounded-b-md" : "top-0 -z-30 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2">
          <h4 className="text-gray-300 underline decoration-gray-300 underline-offset-4 decoration-2">
            NAVIGATIONS
          </h4>
          {lists.map((list, i) => (
            <Link href={list.href} key={i}>
              {list.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-gray-300 underline decoration-gray-300 underline-offset-4 decoration-2">
            SETTINGS
          </h4>
          <p>
            <Link href={"/profile"}>Profile</Link>
          </p>
          <p onClick={() => signOut()} className="cursor-pointer">
            Logout
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-gray-300 underline decoration-gray-300 underline-offset-4 decoration-2">
            MORE
          </h4>
          <div className="flex items-center gap-6">
            <Link href={"/profile/cart"} className="relative">
              <i className="bx bx-cart-alt text-3xl" />
              {cart?.length || 0 > 0 ? (
                <span className="w-6 h-6 text-center rounded-full bg-red-500 absolute left-4">
                  {cart?.length}
                </span>
              ) : null}
            </Link>
            <Link href={"/profile/favorite"} className="relative">
              <i className="bx bx-heart text-3xl" />
              {fav?.length || 0 > 0 ? (
                <span className="w-6 h-6 text-center rounded-full bg-red-500 absolute left-4">
                  {fav?.length}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </nav>
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
