import React from "react";
import { useRouter } from "next/router";
import Navbar from "../Navbar";
import { Poppins } from "next/font/google";
import Footer from "../Footer";

type AppShellProps = {
  children: React.ReactNode;
};

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const disabledNavbar = ["auth", "_error", "admin"];
const disabledFooter = ["auth", "_error", "admin", "profile"];

const AppShell = ({ children }: AppShellProps) => {
  const { pathname } = useRouter();
  return (
    <main className={poppins.className}>
      {!disabledNavbar.includes(pathname.split("/")[1]) && <Navbar />}
      <section
        className={`${pathname !== "/" ? "max-w-layout mx-auto" : null}`}
      >
        {children}
      </section>
      {!disabledFooter.includes(pathname.split("/")[1]) &&
        pathname !== "/products/create_product" &&
        pathname !== "/products/edit_product" && <Footer />}
    </main>
  );
};

export default AppShell;
