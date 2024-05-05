import FormProduct from "@/components/Fragments/FormProduct";
import { productsServices } from "@/services/products";
import { OtherSpec, schema, TCreatedProduct, TSchema } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  id: string;
};

const EditView = ({ id }: Props) => {
  const { back } = useRouter();
  const [stock, setStock] = React.useState<OtherSpec[]>([]);
  const sizeRef = React.useRef<HTMLInputElement>(null);
  const stockRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);
  const [photoProduct, setPhotoProduct] = React.useState<string[]>([]);
  const [progress, setProgress] = React.useState<number>(0);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
  });

  async function fetchPorduct() {
    const res = await productsServices.detail(id);
    const data = res.data.payload;
    setPhotoProduct(data.photo_product);
    setStock(data.other_specs);
    setValue("name_product", data.name_product);
    setValue("description", data.description);
    setValue("categories", data.categories);
  }

  React.useEffect(() => {
    if (id) {
      fetchPorduct();
    }
  }, [id]);

  const handleCreateProduct = async (data: TSchema) => {
    if (photoProduct.length <= 0)
      return toast.error("Product image cannot be empty");
    if (stock.length <= 0)
      return toast.error("At least one specified to your product");
    const data_product: TCreatedProduct = {
      ...data,
      other_specs: stock,
      photo_product: photoProduct,
    };
    const res = await productsServices.update(id, data_product);
    if (res.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
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
        <FormProduct
          control={control}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={handleCreateProduct}
          isSubmitting={isSubmitting}
          sizeRef={sizeRef}
          stockRef={stockRef}
          priceRef={priceRef}
          stock={stock}
          setStock={setStock}
          progress={progress}
          setProgress={setProgress}
          setPhotoProduct={setPhotoProduct}
        />
      </section>
    </main>
  );
};

export default EditView;
