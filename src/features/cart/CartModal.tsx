import { useCart } from "@/context/cart/cart.context";
import * as React from "react";

export default function CartModal() {
  const cart = useCart();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="relative" onClick={() => setOpen((prev) => !prev)}>
        <i className="bx bx-cart-alt text-3xl" />
        {cart?.length || 0 > 0 ? (
          <span className="w-6 h-6 text-center rounded-full bg-red-500 absolute left-4">
            {cart?.length}
          </span>
        ) : null}
      </button>
    </>
  );
}
