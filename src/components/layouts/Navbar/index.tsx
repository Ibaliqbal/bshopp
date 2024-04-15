import Link from "next/link";
import { useRouter } from "next/router";
import NavUser from "./NavUser";
import NavResponsive from "./NavResponsive";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const navigation = [
  {
    href: "/",
    name: "Home",
  },
  {
    href: "/products",
    name: "Products",
  },
];

const Navbar = () => {
  const { pathname } = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });
  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="bg-black text-white z-[9999] sticky top-0"
    >
      <section className="max-w-layout p-4 flex items-center mx-auto justify-between">
        <h1 className="text-2xl font-bold">BShopp</h1>
        {/* ini ukuran dekstop dan tablet */}
        <nav className="md:flex items-center text-xl gap-6 hidden">
          {navigation.map((nav, i) => {
            return (
              <p
                key={i}
                className={` font-semibold hover:border-b-2 hover:border-b-white hover:pb-1 transition-all duration-200 ease-out ${
                  nav.href.split("/")[1] === pathname.split("/")[1]
                    ? "border-b-2 border-b-white pb-1"
                    : null
                }`}
              >
                <Link href={nav.href}>{nav.name}</Link>
              </p>
            );
          })}
        </nav>
        {/* ini Untuk ukuran mobile */}
        <div className="md:hidden w-full flex justify-end items-center ml-3 relative">
          <NavResponsive lists={navigation} />
        </div>
        {/* ini Untuk ukuran desktop dan tablet */}
        <div className="hidden md:block">
          <NavUser />
        </div>
      </section>
    </motion.header>
  );
};

export default Navbar;
