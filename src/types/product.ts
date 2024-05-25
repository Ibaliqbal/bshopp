import { UUID } from "crypto";
import { FieldValue, Timestamp } from "firebase/firestore";
import { Options } from "react-select";
import { z } from "zod";

export const sortingOption = [
  {
    value: 32,
    label: "Price : High - Low",
    symbol: "PHL",
  },
  {
    value: 15,
    label: "Price : Low - High",
    symbol: "PLH",
  },
];

export enum SORTING_OPT {
  PHL = "PHL",
  PLH = "PLH",
}

export interface OtherSpec {
  size: string | undefined;
  stock: number;
  price: number;
  soldout: number;
}

export type Comments = {
  id: string;
  name: string;
  photo_profile: string;
  rating: number;
  text: string;
  comment_at: Timestamp;
  reply_to?: string;
};

export type Product = {
  id: string;
  photo_product: string[];
  soldout: number;
  comments: Comments[];
  name_product: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  other_specs?: OtherSpec[];
  categories: { value: number; label: string } | null;
};

export type TCreatedProduct = {
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
  name_product: string;
  description: string;
  categories: { value: number; label: string } | null;
  comments?: [];
  soldout?: number;
  photo_product: string[];
  other_specs: OtherSpec[];
};

export const optionSchema = z.object({
  value: z.number(),
  label: z.string(),
});

export const schema = z.object({
  name_product: z.string(),
  description: z.string(),
  categories: optionSchema.nullable(),
});

export type TSchema = z.infer<typeof schema>;
export type TOption = z.infer<typeof optionSchema>;
export type TGroupedOptions = {
  label: string;
  options: readonly TOption[];
};

export const mensOption: Options<TOption> = [
  {
    value: 1040,
    label: "Shirt",
  },
  {
    value: 1360,
    label: "Jacket Men",
  },
  {
    value: 1829,
    label: "Pants Men",
  },
  {
    value: 1911,
    label: "Shoes Men",
  },
  {
    value: 1863,
    label: "Accessories Men",
  },
];

export const mensCheck = mensOption.map((option) => option.value);

export const womensOption: Options<TOption> = [
  {
    value: 1366,
    label: "Dress",
  },
  {
    value: 1573,
    label: "Shoes Women",
  },
  {
    value: 1077,
    label: "Accessories Women",
  },
  {
    value: 1663,
    label: "Jacket Women",
  },
  {
    value: 1390,
    label: "Pants Women",
  },
];

export const womenCheck = womensOption.map((option) => option.value);

export const groupedOptions: TGroupedOptions[] = [
  {
    label: "Men",
    options: mensOption,
  },
  {
    label: "Women",
    options: womensOption,
  },
];

export const sortFilter = [
  {
    label: "Price : Low - High",
    value: 96,
  },
  {
    label: "Price : High - Low",
    value: 36,
  },
  {
    label: "Rating : Low - High",
    value: 68,
  },
  {
    label: "Rating : High - Low",
    value: 62,
  },
];
