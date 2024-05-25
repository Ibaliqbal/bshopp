import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const Sidebar = ({
  list,
  title,
}: {
  list: {
    name: string;
    icon: string;
    linkTo: string;
  }[];
  title: "Admin Panel" | "Profile Panel";
}) => {
  const { data } = useSession();
  const { pathname, push } = useRouter();

  return (
    <aside className="bg-black rounded-md p-3 lg:basis-1/4 hidden h-dvh lg:flex flex-col items-center w-full gap-8 sticky top-3">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <ul className="flex flex-col gap-6 w-full">
        {list.map((item, i) => (
          <li
            key={i}
            onClick={() => push(item.linkTo)}
            className={`bg-white ${
              pathname === item.linkTo ? "bg-opacity-100" : "bg-opacity-80"
            } px-4 py-5 font-semibold text-xl rounded-md flex gap-2 items-center cursor-pointer`}
          >
            <i className={`bx ${item.icon} text-3xl`} />
            {item.name}
          </li>
        ))}
      </ul>
      {title === "Admin Panel" ? (
        <div className="grow w-full items-end flex pb-4">
          {data ? (
            <button
              className="bg-red-600 rounded-md text-white text-lg w-full py-5 font-bold"
              onClick={() => signOut()}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-white rounded-md text-black w-full text-lg py-5 font-bold"
              onClick={() => signIn()}
            >
              Login
            </button>
          )}
        </div>
      ) : null}
    </aside>
  );
};

export default Sidebar;
