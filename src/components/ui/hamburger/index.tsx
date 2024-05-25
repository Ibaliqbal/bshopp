import React from "react";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  className?: string;
};

const Hamburger = ({
  isOpen,
  setIsOpen,
  height,
  width,
  color,
  strokeWidth,
  className,
}: Props) => {
  return (
    <button
      className={`menu ${className} ${isOpen ? "opened" : ""}`}
      onClick={() => setIsOpen((prev) => !prev)}
      aria-label="Main Menu"
      aria-expanded={isOpen}
    >
      <svg width={`${width}`} height={`${height}`} viewBox="0 0 100 100">
        <path
          className="line line1"
          stroke={color}
          d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
        />
        <path
          className="line line2"
          d={`M 20,50 H ${strokeWidth}`}
          stroke={color}
        />
        <path
          className="line line3"
          stroke={color}
          d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
        />
      </svg>
    </button>
  );
};

export default Hamburger;
