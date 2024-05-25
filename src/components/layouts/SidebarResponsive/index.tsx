import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Hamburger from "@/components/ui/hamburger";

const SidebarResponsive = ({
  list,
}: {
  list: Array<{
    name: string;
    icon: string;
    linkTo: string;
  }>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menu = {
    open: {
      width: "210px",
      height: "270px",
      top: "-25px",
      right: "-25px",
      transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
      width: "40px",
      height: "40px",
      top: "0px",
      right: "0px",
      transition: {
        duration: 0.75,
        delay: 0.25,
        type: "tween",
        ease: [0.76, 0.34, 0.24, 1],
      },
    },
  };

  const childrenAnimte = {
    open: {
      opacity: 0,
      scale: 0,
      translateY: 80,
      translateX: -20,
    },
    enter: (i: number) => ({
      opacity: 1,
      scale: 1,
      translateY: 0,
      translateX: 0,
      transformOrigin: "bottom right",
      transition: {
        duration: 0.65,
        delay: 0.5 + i * 0.1,
        ease: [0.215, 0.61, 0.355, 1],
        opacity: { duration: 0.35 },
      },
    }),
    closed: (i: number) => ({
      opacity: 0,
      scale: 0,
      translateY: 80,
      transformOrigin: "bottom right",
      transition: {
        duration: 0.5,
        delay: 0.5 * i * 0.1,
        type: "linear",
        ease: [0.76, 0, 0.24, 1],
      },
    }),
  };
  return (
    <aside className="lg:hidden fixed bottom-5 right-5 p-2 bg-black rounded-md">
      <motion.nav
        variants={menu}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="rounded-md bg-black"
      >
        <AnimatePresence>
          {isOpen && (
            <article className="h-full box-border flex flex-col gap-3 p-2">
              {list.map((item, i) => {
                return (
                  <Link
                    href={item.linkTo}
                    key={i}
                    onClick={() => setIsOpen((prev) => !prev)}
                  >
                    <motion.p
                      variants={childrenAnimte}
                      initial="open"
                      animate="enter"
                      exit="closed"
                      custom={i}
                      className="flex items-center rounded-sm text-xl p-2 text-white w-full h-full"
                    >
                      <i className={`bx ${item.icon} text-xl mr-3`} />
                      {item.name}
                    </motion.p>
                  </Link>
                );
              })}
            </article>
          )}
        </AnimatePresence>
      </motion.nav>
      <Hamburger
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width={50}
        height={50}
        color="white"
        strokeWidth={60}
        className="absolute bottom-1 right-1"
      />
    </aside>
  );
};

export default SidebarResponsive;
