import Button from "@/components/ui/button";
import { useUser } from "@/context/user/user.context";
import { checkoutService } from "@/services/checkout";
import { Cart, User } from "@/types/user";
import { converPrice } from "@/utils/convertPrice";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Summary = ({ carts }: { carts: Cart[] }) => {
  const { data } = useSession();
  const router = useRouter();
  const user: User = useUser();
  const [token, setToken] = useState("");
  const subTotal = carts
    ?.filter((c) => c.checked)
    .reduce((acc, curr) => acc + curr.price * curr.quantity, 0) as number;
  const tax = (subTotal * 4) / 100;
  const { mutate: checkoutHandle } = useMutation({
    mutationFn: async () => {
      if (!data?.user) return router.push("/auth/login");
      const dataCheckout = carts
        .filter((cart) => cart.checked)
        .map((cart) => ({
          name: cart.name,
          qty: cart.quantity,
          price: cart.price,
          photo: cart.photo,
          variant: cart.variant,
          category: cart.category,
          id: cart.id,
        }));
      const newData = {
        id: user?.id || "",
        cart: dataCheckout,
      };
      const { data: result } = await checkoutService.pay(newData);

      return result;
    },
    onSuccess: (result) => {
      setToken(result.token);
    },
  });

  useEffect(() => {
    if (token) {
      // @ts-expect-error

      window.snap?.pay(token, {
        onSuccess: async () => {
          router.push("/profile/order");
          toast.success("Payment successfully");
        },
        onPending: () => {
          router.push("/profile/order");
          toast.success("Waiting for paymnet");
        },
        onError: () => {
          toast.error("Gagal");
        },
        onClose: () => {
          window.location.assign("/profile/order");
          toast.error("You have not completed the payment...");
        },
      });
    }
  }, [token, router]);

  useEffect(() => {
    const mkidtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = mkidtransUrl;
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="md:col-span-1 w-full">
      <h2 className="font-extrabold text-xl">Summary</h2>
      <article className="mt-4 flex flex-col gap-4 pb-4 border-b-2 border-b-slate-700">
        <div className="w-full flex items-center justify-between">
          <h4 className="text-sm md:text-md font-semibold">Subtotal</h4>
          <p className="text-sm md:text-md font-bold">
            {converPrice(subTotal)}
          </p>
        </div>
        <div className="w-full flex items-center justify-between">
          <h4 className="text-sm md:text-md font-semibold">Tax</h4>
          <p className="text-sm md:text-md font-bold">{converPrice(tax)}</p>
        </div>
      </article>
      <div className="w-full flex items-center justify-between mt-4 pb-4 border-b-2 border-b-slate-700">
        <h4 className="text-sm md:text-md font-semibold">Total</h4>
        <p className="text-sm md:text-md font-bold">
          {converPrice(subTotal + tax)}
        </p>
      </div>
      <Button
        sizes="sm"
        className="w-full text-white mt-5 font-semibold"
        onClick={() => checkoutHandle()}
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
