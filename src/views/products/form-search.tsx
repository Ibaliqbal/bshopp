import Input from "@/components/ui/input";
import useDebounce from "@/hooks/useDebaounce";
import { useRouter } from "next/router";
import React from "react";

export default function FormSearch() {
  const { push } = useRouter();
  const [searchProducts, setSearchProducts] = React.useState<
    string | undefined
  >(undefined);
  const debounce = useDebounce(searchProducts, 1000);
  return (
    <form
      className="flex gap-2 items-center border-b-2 border-b-black pb-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!searchProducts || searchProducts.trim() === "") return;
        push(`/products/search?q=${searchProducts}`);
      }}
    >
      <Input
        className="w-full px-5 py-3 focus:outline-none"
        name="search"
        type="text"
        placeholder="Search"
        value={searchProducts || ""}
        onChange={(e) => setSearchProducts(e.target.value)}
      />
      <button
        className="border-l-2 border-l-black px-3 text-black"
        type="submit"
      >
        <i className="bx bx-search-alt-2 text-2xl" />
      </button>
    </form>
  );
}
