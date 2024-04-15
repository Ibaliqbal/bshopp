import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import React from "react";

type InputFiledProps = {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const InputField = ({
  type,
  name,
  label,
  placeholder,
  value,
  className,
}: InputFiledProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Label htmlFor={name} className="text-xl font-semibold">
        {label}
      </Label>
      <Input
        className="w-full px-4 py-3 "
        placeholder={placeholder}
        type={type}
        value={value}
        name={name}
        id={name}
      />
    </div>
  );
};

export default InputField;
