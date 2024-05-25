import { Timestamp } from "firebase/firestore";
import { CheckoutCart } from "./checkout";

export type Orders = {
  id?: string;
  cart: Array<CheckoutCart>;
  order_id: string;
  status: "PAID" | "PENDING" | "CANCELED";
  orderAt: Timestamp;
  token: string;
};

export type TCreate = {
  token: string;
  order_id: string;
  status: string;
  username: string;
  cart?: CheckoutCart[];
  id?: string | undefined;
};
