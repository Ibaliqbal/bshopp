import { TStatus } from "@/services/checkout/service";
import { Timestamp } from "firebase/firestore";

export type CheckoutCart = {
  category: string;
  id: string;
  name: string;
  photo: string;
  price: number;
  qty: number;
  variant: string;
};
export type TCheckout = {
  cart: CheckoutCart[];
  order_id: string;
  user_id: string;
  status: TStatus;
  gross_amount: number;
  token: string;
  checkoutAt: Timestamp;
  id: string;
};

export type TPay = {
  cart: CheckoutCart[];
  id: string;
};

export type TCreate = {};
