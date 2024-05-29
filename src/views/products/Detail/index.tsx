import { OtherSpec, Product } from "@/types/product";
import Image from "next/image";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { converPrice } from "@/utils/convertPrice";
import Button from "@/components/ui/button";
import { Tooltip } from "react-tooltip";
import { Rating, ThinStar } from "@smastrom/react-rating";
import Link from "next/link";
import { FavoriteContext } from "@/context/favorite/favorite.context";
import { Cart } from "@/types/user";
import { CartContext } from "@/context/cart/cart.context";
import { formatDistance } from "date-fns";
import { TComment } from "@/types/comment";

export const myStyles = {
  itemShapes: ThinStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#fbf1a9",
};

export default function DetailView({
  data,
  selectedImage,
  selectPrice,
  setSelectedImage,
  setSelectPrice,
  comments,
}: {
  data: Product;
  selectedImage: string;
  selectPrice: number;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  setSelectPrice: React.Dispatch<React.SetStateAction<number>>;
  comments: Array<TComment>;
}) {
  const fav = useContext(FavoriteContext);
  const cart = useContext(CartContext);
  const totalRating =
    comments.length > 0
      ? comments.reduce((acc, curr) => acc + curr.rating, 0) / comments.length
      : 0;
  return (
    <motion.section className="flex flex-wrap justify-between mb-8 border-b-2 border-b-black pb-3">
      <motion.figure className="w-full md:w-1/2 p-4">
        <Image
          src={selectedImage ?? data.photo_product[0]}
          alt={data.name_product}
          width={800}
          height={800}
          className="aspect-[1/1.2] object-cover w-full"
          priority
        />
        <div className="mt-2 flex flex-wrap gap-3">
          {data.photo_product.map((photo: string, i: number) => {
            return (
              <Image
                key={i}
                src={photo}
                alt={data.name_product}
                width={200}
                height={200}
                loading="lazy"
                className="cursor-pointer w-[150px] aspect-[1/.8]"
                onClick={() => setSelectedImage(photo)}
                onMouseEnter={() => setSelectedImage(photo)}
              />
            );
          })}
        </div>
      </motion.figure>
      <motion.div className="w-full md:w-1/2 p-4 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{data.name_product}</h1>
        <p className="text-gray-500 font-bold">{data.categories?.label}</p>
        <div className="flex items-center gap-2">
          <Rating
            readOnly
            value={totalRating}
            style={{
              maxWidth: 120,
              marginBottom: ".5rem",
              marginTop: ".5rem",
            }}
            itemStyles={myStyles}
          />
          <p className="text-lg">{totalRating.toFixed(2)}</p>
        </div>
        <p className="text-4xl font-semibold">{converPrice(selectPrice)}</p>
        <p className="text-lg">
          Stock : {data.other_specs?.reduce((acc, curr) => acc + curr.stock, 0)}{" "}
          available
        </p>
        <div>
          <h1 className="mb-3">Select Variants</h1>
          <section className="flex gap-3 items-center">
            {data.other_specs?.map((item: OtherSpec, i: number) => {
              return (
                <div key={i}>
                  <Button
                    data-tooltip-id={item.size}
                    data-tooltip-content={`Stock : ${item.stock}`}
                    data-tooltip-variant="dark"
                    type="button"
                    sizes="sm"
                    onClick={() => setSelectPrice(item.price)}
                    className={`${
                      selectPrice === item.price
                        ? "bg-white border-2 border-black"
                        : "text-white"
                    }`}
                  >
                    {item.size}
                  </Button>
                  <Tooltip id={item.size} />
                </div>
              );
            })}
          </section>
        </div>
        <Button
          className="w-full text-white flex items-center gap-5 justify-center text-4xl"
          onClick={() => fav.handleFav(data)}
        >
          <i
            className={`bx text-3xl transition-all duration-200 ease-out ${
              fav?.favorite?.find((product) => product.id === data.id)
                ? "bxs-heart text-red-500"
                : "bx-heart"
            }`}
          />
          Favorite
        </Button>
        <Button
          className="w-full text-white flex items-center gap-5 justify-center"
          onClick={() => {
            const cart_data: Cart = {
              id: data?.id,
              price: selectPrice,
              quantity: 1,
              variant: data.other_specs?.filter(
                (item) => item.price === selectPrice
              )[0].size,
              photo: data.photo_product[0],
              checked: false,
              name: data.name_product,
              category: data.categories?.label,
            };
            cart.handleAdd(cart_data);
          }}
        >
          <i className="bx bx-cart-alt text-3xl" />
          Add to Cart
        </Button>
        <div className="border-b-2 border-b-black pb-3">
          <h3 className="text-xl font-bold mb-4">Description</h3>
          <p className="">{data.description}</p>
        </div>
        {comments.length > 0 ? (
          <div>
            <h4 className="mb-4 text-xl font-semibold">Reviews product</h4>
            <section className="flex flex-col gap-6 items-center mb-4">
              {comments.slice(0, 3).map((comment, i) => {
                return (
                  <article key={i} className="w-full">
                    <div className=" flex gap-3 items-center">
                      <Image
                        alt={"/userdeafult.png"}
                        src={
                          comment.photo_profile
                            ? comment.photo_profile
                            : "/userdefault.png"
                        }
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div className="flex flex-col justify-between">
                        <h6>{comment.name}</h6>
                        <p>
                          {formatDistance(
                            new Date(comment.comment_at.seconds * 1000),
                            new Date(),
                            {
                              addSuffix: true,
                              includeSeconds: true,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <Rating
                      readOnly
                      value={comment.rating}
                      style={{
                        maxWidth: 150,
                        marginBottom: ".5rem",
                        marginTop: ".5rem",
                      }}
                      itemStyles={myStyles}
                    />
                    <p>{comment.text}</p>
                  </article>
                );
              })}
            </section>
            <Link
              href={`/products/${data.id}/comments`}
              className="underline underline-offset-8 decoration-2"
            >
              More reviews
            </Link>
          </div>
        ) : (
          <p className="text-center underline underline-offset-8 decoration-2">
            No review,{" "}
            <Link
              href={`/products/${data.id}/comments`}
              className="text-blue-600"
            >
              Create review now
            </Link>
          </p>
        )}
      </motion.div>
    </motion.section>
  );
}
