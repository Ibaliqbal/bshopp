import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { uploadFile } from "@/lib/firebase/services";
import {
  OtherSpec,
  TCreatedProduct,
  TGroupedOptions,
  TOption,
  TSchema,
  groupedOptions,
  mensOption,
  schema,
} from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { StylesConfig, ThemeConfig } from "react-select";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { productsServices } from "@/services/products";

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

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles: CSSProperties = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const formatGroupLabel = (data: TGroupedOptions) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const ProductCreateView = () => {
  const { back } = useRouter();
  const [stock, setStock] = useState<OtherSpec[]>([]);
  const sizeRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [photoProduct, setPhotoProduct] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
  });

  const handleCreateProduct = async (data: TSchema) => {
    if (photoProduct.length <= 0)
      return toast.error("Product image cannot be empty");
    if (stock.length <= 0)
      return toast.error("At least one specified to your product");
    const data_product: TCreatedProduct = {
      ...data,
      other_specs: stock,
      photo_product: photoProduct,
      comments: [],
      soldout: 0,
    };
    const res = await productsServices.createProduct(data_product);
    if (res.status === 201) {
      toast.success(res.data.message);
      reset();
      setPhotoProduct([]);
      setStock([]);
    } else {
      toast.error(res.data.message);
      reset();
      setPhotoProduct([]);
      setStock([]);
    }
  };

  return (
    <main>
      <i
        className="bx bx-arrow-back mt-5 text-4xl cursor-pointer"
        onClick={() => back()}
      />
      <section className="w-full grid lg:grid-cols-3 place-items-center lg:place-items-stretch gap-5 mt-5">
        <div className="lg:col-span-1 w-full border-4 border-gray-700 rounded-md h-fit relative">
          {photoProduct.length > 0 ? (
            <Image
              src={photoProduct[photoProduct.length - 1]}
              alt="Product"
              width={1000}
              height={1000}
              quality={100}
              className="w-full aspect-[1/1.2] object-cover"
            />
          ) : (
            <h1 className="text-2xl text-center p-4 font-semibold">
              Upload your image product
            </h1>
          )}

          <div className="flex w-full max-w-full border-t-4 border-t-gray-700 overflow-y-auto kum-img gap-2 mt-3 items-center h-[150px]">
            {photoProduct.length > 0 &&
              photoProduct.map((photo, i) => (
                <Image
                  key={i}
                  src={photo}
                  width={200}
                  height={200}
                  alt="Product"
                  className="w-[150px] h-full"
                />
              ))}
          </div>
        </div>
        <form
          onSubmit={handleSubmit(handleCreateProduct)}
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
                    console.log(e.target.files[0]);
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
                    const result = [...stock, data];
                    setStock(result);
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
            className="self-end px-16 mr-4 text-white"
            disabled={isSubmitting || !(progress !== null && progress < 100)}
          >
            {isSubmitting || !(progress !== null && progress < 100)
              ? "Loading.."
              : "Create"}
          </Button>
        </form>
      </section>
    </main>
  );
};

export default ProductCreateView;
