import React, { forwardRef } from "react";

// type InputProps = {
//   className?: string;
//   placeholder: string;
//   type: string;
//   name?: string;
//   value?: string;
//   handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   disabled?: boolean;
// };

type InputProp = React.ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProp>(
  ({ type, id, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        id={id}
        {...props}
        className={`disabled:cursor-not-allowed ${className}`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
