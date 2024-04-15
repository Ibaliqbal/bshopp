import Button from "@/components/ui/button";
import React from "react";
import { Options } from "react-select";

type ListFilterProps = {
  list:
    | Options<{
        label: string;
        value: number;
      }>
    | { label: string; value: number }[];
  title: string;
  selectOptions: number;
  handleFilter: (value: number) => void;
  className?: string;
};

const ListFilter = ({
  list,
  title,
  selectOptions,
  handleFilter,
}: ListFilterProps) => {
  return (
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <section className="mt-3 flex flex-wrap gap-3">
        {list.map((option) => {
          return (
            <Button
              key={option.value}
              sizes="sm"
              className={`border-2 border-white px-4 py-2 transition-all duration-200 ease-linear ${
                selectOptions === option.value
                  ? "bg-white text-black"
                  : "text-white"
              }`}
              onClick={() => handleFilter(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </section>
    </div>
  );
};

export default ListFilter;
