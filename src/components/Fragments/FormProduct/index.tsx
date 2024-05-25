import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { groupedOptions, OtherSpec, TOption, TSchema } from "@/types/product";
import React from "react";
import Select, { StylesConfig, ThemeConfig } from "react-select";
import { TGroupedOptions } from "../../../types/product";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { uploadFile } from "@/lib/firebase/services";
import { v4 as uuidv4 } from "uuid";

type Props = {
  register: UseFormRegister<TSchema>;
  control: Control<TSchema, any>;
  handleSubmit: UseFormHandleSubmit<TSchema, undefined>;
  onSubmit: (data: TSchema) => Promise<string | number | undefined>;
  isSubmitting: boolean;
  sizeRef: React.RefObject<HTMLInputElement>;
  stockRef: React.RefObject<HTMLInputElement>;
  priceRef: React.RefObject<HTMLInputElement>;
  stock: OtherSpec[];
  setStock: React.Dispatch<React.SetStateAction<OtherSpec[]>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setPhotoProduct: React.Dispatch<React.SetStateAction<string[]>>;
  isEdit: boolean;
};

const customStyles: StylesConfig<TOption, false, TGroupedOptions> = {
  control: (provided) => ({
    ...provided,
    minHeight: "50px", // Mengatur tinggi minimum
    fontSize: "16px", // Mengatur ukuran font
    border: "2px solid black",
  }),
};

const customTheme: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: "black",
  },
});

const FormProduct = ({
  handleSubmit,
  control,
  register,
  onSubmit,
  isSubmitting,
  sizeRef,
  stockRef,
  priceRef,
  stock,
  setStock,
  progress,
  setProgress,
  setPhotoProduct,
  isEdit,
}: Props) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="lg:col-span-2 w-full flex flex-col pb-24"
    >
      <div className="w-full lg:grid gap-3 items-center  p-4 flex flex-col-reverse lg:grid-cols-2 ">
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="name_product" className="text-xl font-semibold">
            Name Product
          </Label>
          <Input
            placeholder="Input your product name"
            type="text"
            id="name_product"
            {...register("name_product")}
            className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="categories" className="text-xl font-semibold">
            Category
          </Label>
          <Controller
            name="categories"
            control={control}
            render={({ field }) => {
              return (
                <Select<TOption, false, TGroupedOptions>
                  {...field}
                  id="categories"
                  instanceId={"categories"}
                  options={groupedOptions}
                  isSearchable
                  isClearable
                  styles={customStyles}
                  theme={customTheme}
                />
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-3 lg:mt-4 mt-0 w-full">
          <Label
            htmlFor="image_product"
            className="text-xl font-semibold inline-flex items-center gap-2 cursor-pointer w-fit"
          >
            Upload Image <i className="bx bxs-camera-plus text-2xl" />
          </Label>
          <Input
            placeholder="Input your product name"
            type="file"
            id="image_product"
            className="hidden"
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                const file = e.target.files[0];
                const formatFile = file.type.split("/")[1];
                uploadFile(
                  file,
                  `products/${uuidv4()}.${formatFile}`,
                  setPhotoProduct,
                  setProgress
                );
              }
            }}
          />
        </div>
      </div>
      <section className="m-4 p-4 border-2 border-gray-700 rounded-md">
        <h1 className="text-xl font-semibold mb-4">Other Spesification</h1>
        <div className=" flex items-center flex-col lg:flex-row gap-3">
          <div className="flex flex-col gap-2 grow w-full">
            <Label htmlFor="size" className="text-xl font-semibold">
              Size
            </Label>
            <Input
              placeholder="Input your product size"
              type="text"
              id="size"
              ref={sizeRef}
              className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 grow w-full">
            <Label htmlFor="stock" className="text-xl font-semibold">
              Stock
            </Label>
            <Input
              placeholder="Input your product stock"
              type="text"
              id="stock"
              ref={stockRef}
              className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 grow w-full">
            <Label htmlFor="price" className="text-xl font-semibold">
              Price
            </Label>
            <Input
              placeholder="Input your product price"
              type="text"
              id="price"
              ref={priceRef}
              className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
            />
          </div>
          <Button
            type="button"
            sizes="sm"
            className="self-end grow-0 lg:w-auto w-full flex items-center text-white"
            onClick={() => {
              const data = {
                size: sizeRef.current?.value,
                stock: Number(stockRef.current?.value),
                price: Number(priceRef.current?.value),
                soldout: 0,
              };
              if (sizeRef.current?.value) {
                if (isEdit) {
                  setStock((prev) =>
                    prev.map((spec) => {
                      if (spec.size === data.size) {
                        return {
                          ...spec,
                          stock: spec.stock + data.stock,
                        };
                      } else {
                        return spec;
                      }
                    })
                  );
                } else {
                  const result = [...stock, data];
                  setStock(result);
                }
              }
            }}
          >
            +
          </Button>
        </div>
        <article className="mt-4">
          {stock.map((item, i) => {
            return (
              <div
                key={i}
                className=" flex items-center flex-col lg:flex-row gap-3 "
              >
                <div className="flex flex-col gap-2 grow w-full">
                  <Label htmlFor="size" className="text-xl font-semibold">
                    Size
                  </Label>
                  <Input
                    placeholder="Input your product size"
                    type="text"
                    id="size"
                    value={item.size}
                    disabled
                    className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 grow w-full">
                  <Label htmlFor="stock" className="text-xl font-semibold">
                    Stock
                  </Label>
                  <Input
                    placeholder="Input your product stock"
                    type="text"
                    id="stock"
                    value={item.stock}
                    disabled
                    className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 grow w-full">
                  <Label htmlFor="price" className="text-xl font-semibold">
                    Price
                  </Label>
                  <Input
                    placeholder="Input your product price"
                    type="text"
                    id="price"
                    value={item.price}
                    disabled
                    className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
                  />
                </div>
                <Button
                  type="button"
                  sizes="sm"
                  className="self-end grow-0 lg:w-auto w-full flex items-center bg-red-600"
                  onClick={() => {
                    setStock(stock.filter((_, index) => index !== i));
                  }}
                >
                  X
                </Button>
              </div>
            );
          })}
        </article>
      </section>
      <div className="flex flex-col gap-3 p-4">
        <Label htmlFor="description" className="text-xl font-semibold">
          Description Product
        </Label>
        <textarea
          placeholder="Input your product name"
          id="description"
          {...register("description")}
          className="px-4 py-3 border-2 border-black rounded-md min-h-[200px] resize-none"
        />
      </div>
      <Button
        type="submit"
        sizes="md"
        className="self-end px-16 mr-4 text-white disabled:cursor-not-allowed disabled:bg-opacity-70"
        disabled={isSubmitting || !(progress !== null && progress < 100)}
      >
        {isSubmitting || !(progress !== null && progress < 100)
          ? "Loading.."
          : isEdit
          ? "Update"
          : "Create"}
      </Button>
    </form>
  );
};

export default FormProduct;
