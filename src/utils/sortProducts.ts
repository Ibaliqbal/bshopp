import { Product, SORTING_OPT, sortingOption } from "@/types/product";

export function sortProducts(data: Product[], value: number) {
  switch (sortingOption.find((item) => item.value === value)?.symbol) {
    case `${SORTING_OPT.PHL}`:
      // Sorting filterProducts based on price in descending order within other_specs array
      return data
        .slice()
        .sort(
          (a, b) =>
            (b.other_specs?.sort((x, y) => y.price - x.price)[0]?.price ?? 0) -
            (a.other_specs?.sort((x, y) => y.price - x.price)[0]?.price ?? 0)
        );
    case `${SORTING_OPT.PLH}`:
      // Sorting filterProducts based on price in descending order within other_specs array

      return data
        .slice()
        .sort(
          (a, b) =>
            (a.other_specs?.sort((x, y) => y.price - x.price)[0]?.price ?? 0) -
            (b.other_specs?.sort((x, y) => y.price - x.price)[0]?.price ?? 0)
        );
    default:
      console.log("gagal");
      break;
  }
}
