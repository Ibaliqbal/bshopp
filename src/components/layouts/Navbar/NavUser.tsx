import { useCart } from "@/context/cart/cart.context";
import { useFavorite } from "@/context/favorite/favorite.context";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function NavUser() {
  const { data }: any = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fav = useFavorite();
  const cart = useCart();
  return data ? (
    <section className="flex items-center gap-5 rounded-xl">
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
      <div className="relative md:block">
        <button
          className={`rounded-xl py-2 ${
            !isOpen ? "shadow-md shadow-slate-600" : null
          } flex items-center justify-between gap-5 px-5 py-2`}
          onMouseDown={() => setIsOpen((prev) => !prev)}
        >
          <Image
            width={50}
            height={50}
            src={data.user.image ? data.user.image : "/userdefault.png"}
            alt="profile"
            className={`${data ? "rounded-full" : null}`}
          />
          <i
            className={`bx bx-chevron-up text-3xl mt-[0.15rem] ${
              isOpen && "rotate-180"
            } transition-transform duration-200 ease-linear`}
          />
        </button>
        <ul
          className={`absolute flex flex-col shadow-lg bg-black shadow-slate-600 py-4 px-5 pt-5 transition-all text-nowrap duration-200 ease-linear lg:items-center gap-3 w-full ${
            isOpen ? "top-full z-50" : "top-0 -z-30 opacity-0"
          }`}
        >
          <li>
            <Link href={"/profile"}>Profile</Link>
          </li>
          <li onClick={() => signOut()} className="cursor-pointer">
            Logout
          </li>
        </ul>
      </div>
    </section>
  ) : (
    <button
      className="bg-white rounded-md text-black text-lg px-4 py-2"
      onClick={() => signIn()}
    >
      Login
    </button>
  );
}
