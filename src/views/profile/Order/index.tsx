import ProfileLayout from "@/components/layouts/ProfileLayout";
import { useOrder } from "@/context/order/order.context";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const OrderView = () => {
  const order = useOrder();
  return (
    <ProfileLayout>
      {order && order.length > 0 ? (
        <div className="pt-10 pb-24 grid md:grid-cols-3 gap-4">Order</div>
      ) : (
        <section className="w-full h-dvh flex items-center justify-center">
          <div className="flex flex-col gap-6 items-center">
            <Image
              src={"/order.svg"}
              alt="no-cart"
              width={400}
              height={400}
              priority
            />
            <h3 className="font-semibold text-xl">
              No order, checkout products{" "}
              <Link href={"/products"} className="text-blue-600">
                now!
              </Link>
            </h3>
          </div>
        </section>
      )}
    </ProfileLayout>
  );
};

export default OrderView;
