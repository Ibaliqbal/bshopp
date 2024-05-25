import * as React from "react";
import FormSearch from "./form-search";
import { sortingOption } from "@/types/product";

const Header = ({
  handleSorting,
  sortingOption: sorting,
  children,
}: {
  handleSorting: (value: number) => void;
  sortingOption: number;
  children: React.ReactElement;
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <header className="max-w-layout lg:items-center p-4 lg:flex-row flex-col flex lg:justify-between">
      <h3 className="font-bold lg:text-3xl">Welcome to BShopp</h3>
      <div className="flex md:items-center gap-4 px-3 md:flex-row flex-col md:mt-0 mt-3">
        <FormSearch />
        {/* ini utuk ukuran dekstop dan tablet */}
        <section className="relative shadow-lg shadow-slate-600 md:block hidden">
          <button
            className={`${
              !isOpen ? "text-nowrap" : "text-nowrap"
            } flex items-center gap-5  px-12 py-1`}
            onMouseDown={() => setIsOpen((prev) => !prev)}
          >
            {sortingOption.find((item) => item.value === sorting)
              ? sortingOption.find((item) => item.value === sorting)?.label
              : "Sort By"}
            <i
              className={`bx bx-chevron-up text-2xl mt-[0.15rem] ${
                isOpen && "rotate-180"
              } transition-transform duration-200 ease-linear`}
            />
          </button>
          <ul
            className={`absolute flex flex-col bg-white shadow-lg shadow-slate-600  py-4 px-5 transition-all text-nowrap duration-200 ease-linear lg:items-center gap-2 w-full ${
              isOpen ? "top-full z-20" : "top-0 -z-50 opacity-0"
            }`}
          >
            {sortingOption.map((item, i) => {
              return (
                <li
                  key={i}
                  className="cursor-pointer"
                  onClick={() => handleSorting(item.value)}
                >
                  {item?.label}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      {/* Ini untuk ukuran mobile */}
      {children}
    </header>
  );
};

export default Header;
