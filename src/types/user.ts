import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import { Product } from "./product";

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
  username: string;
  email: string;
  password?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  photo_profile: string;
  role: string;
  cart: Cart[];
  type?: string;
  favorite: Product[];
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
