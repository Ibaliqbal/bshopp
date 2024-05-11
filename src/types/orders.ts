import { Timestamp } from "firebase/firestore";
import { ChcekoutCart } from "./checkout";

export type Orders = {
  id?: string;
  cart: Array<ChcekoutCart>;
  order_id: string;
  status: "PAID" | "PENDING" | "CANCELED";
  orderAt: Timestamp;
  token: string;
};
