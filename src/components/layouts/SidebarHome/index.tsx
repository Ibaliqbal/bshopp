import Button from "@/components/ui/button";
import { mensOption, womensOption } from "@/types/product";
import React from "react";
import ListFilter from "./ListFilter";

interface SidebarProps {
  total: number;
  children: React.ReactNode;
}

const Sidebar = ({ total, children }: SidebarProps) => {
  return (
    <aside className="bg-black rounded-md p-3 lg:basis-1/4 hidden h-fit pb-8 lg:flex flex-col w-full gap-5 sticky top-2">
      <h1 className="text-3xl text-white font-bold mt-3">
        All Products {`(${total})`}
      </h1>
      {children}
    </aside>
  );
};

export default React.memo(Sidebar);
