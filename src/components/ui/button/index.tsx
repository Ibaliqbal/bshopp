import React, { ReactNode } from "react";

type TVariant = {
  default: string;
  primary: string;
  secondary: string;
};

type TSize = {
  default: string;
  sm: string;
  md: string;
  lg: string;
};
type TVariantKey = keyof TVariant;
type TSizeKey = keyof TSize;

const variant: TVariant = {
  default: "bg-black rounded-md",
  primary: "bg-green-600 rounded-md",
  secondary: "bg-red-700 rounded-md",
};

const size: TSize = {
  default: "h-20 py-4 px-12 text-xl",
  sm: "h-12 py-4 px-5 text-xs",
  md: "h-14 py-4 px-6 text-sm",
  lg: "h-16 py-4 px-8 text-lg",
};

type ButtonProps = {
  children: ReactNode;
  variants?: TVariantKey;
  sizes?: TSizeKey;
} & React.ComponentPropsWithoutRef<"button">;
const Button = ({
  onClick,
  variants = "default",
  sizes = "default",
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${variant[variants]} ${size[sizes]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
