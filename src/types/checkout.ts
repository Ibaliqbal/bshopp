import { TStatus } from "@/services/checkout/service";

export type TCheckout = {
  cart: any[];
  order_id: string;
  user_id: string;
  status: TStatus;
  gross_amount: number;
  token: string;
};
