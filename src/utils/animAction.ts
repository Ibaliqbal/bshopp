export const variants = {
  open: {
    opacity: 1,
    scale: 1,
    transformOrigin: "top right",
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.4,
      duration: 0.5,
      type: "spring",
    },
  },
  closed: {
    opacity: 0,
    scale: 0,
    transformOrigin: "top right",
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.03,
      duration: 0.5,
      type: "spring",
      delay: 0.4,
    },
  },
};

export const listVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
