import Image from "next/image";
import Link from "next/link";
import React from "react";

const SuccessOrder = () => {
  return (
    <main className="w-full h-dvh flex flex-col items-center justify-center gap-5">
      <figure className="relative w-[400px] h-[400px]">
        <Image
          src={"/thankyou.svg"}
          alt="Thank You"
          fill
          className="w-full h-full object-cover"
        />
      </figure>
      <h1 className="text-2xl md:text-3xl mt-3">
        Thank you for shopping at BShopp
      </h1>
      <Link
        className="w-44 text-center rounded-md text-white py-5 bg-green-600"
        href={"/products"}
      >
        Back to Shopp
      </Link>
    </main>
  );
};

export default SuccessOrder;
