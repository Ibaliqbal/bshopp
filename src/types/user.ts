import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import { Product, optionSchema } from "./product";

export type Cart = {
  id: string;
  variant: string | undefined;
  quantity: number;
  price: number;
  photo: string;
  checked: boolean;
  name: string;
  category: string | undefined;
};

export type User = {
  id: string;
  fullname: string;
  email: string;
  password?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  photo_profile: string;
  role: string;
  cart: Cart[];
  type?: string;
  favorite: Product[];
  provinces?: TOption;
  city?: TOption;
  district?: TOption;
  phone?: number;
  spesifik_address?: string;
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const optionAddressSchema = z.object({
  value: z.number(),
  label: z.string(),
});

export const schema = z.object({
  fullname: z.string().nullable(),
  province: optionAddressSchema.nullable(),
  city: optionAddressSchema.nullable(),
  district: optionAddressSchema.nullable(),
  phone: z.number().nullable(),
  spesifik: z.string().nullable(),
});

export type TOption = z.infer<typeof optionAddressSchema>;

export type TLoginSchema = z.infer<typeof loginSchema>;

export type TSchema = z.infer<typeof schema>;
