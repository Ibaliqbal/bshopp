import React, { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor: string;
  className?: string;
};

const Label = ({ htmlFor, children, className }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
};

export default Label;
