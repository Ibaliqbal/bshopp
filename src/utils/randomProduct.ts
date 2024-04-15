import { Product } from "@/types/product";

export const randomProduct = (data: Product[], gap: number) => {
  try {
    const first = ~~(Math.random() * (data.length - gap) + 1);
    const sec = first + gap;
    const res = data.slice(first, sec);
    return res;
  } catch (error) {
    const err = error as Error;
    return err.message;
  }
};
