import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  open,
  setOpen,
  children,
  className,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed h-dvh w-full top-0 left-0 bg-black bg-opacity-60 z-20"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              scale: 0,
            }}
            className="fixed w-fit h-fit md:max-w-4xl max-w-sm bg-white m-auto inset-0 md:p-4 py-6 px-4 z-30"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  delay: 0.3,
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
              }}
              className={`${className} mt-6`}
            >
              {children}
            </motion.div>
            <span
              className="absolute top-3 right-3 font-bold cursor-pointer"
              onClick={() => setOpen(false)}
            >
              X
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
