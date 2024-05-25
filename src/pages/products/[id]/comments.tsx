import Loader from "@/components/ui/loader";
import { useUser } from "@/context/user/user.context";
import { User } from "@/types/user";
import { myStyles } from "@/views/products/Detail";
import { Rating } from "@smastrom/react-rating";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { formatDistance } from "date-fns";
import { Comments } from "@/types/product";
import Button from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { commentServices } from "@/services/comments";
import { fetchData } from "@/function/product";
import { motion } from "framer-motion";
import { toast } from "sonner";

const schema = z.object({
  text: z.string().min(3, "Please field input at leat 3 caharacters"),
  rating: z.number(),
});

type TSchema = z.infer<typeof schema>;

export default function CommentProductPage() {
  const { query } = useRouter();
  const user: User = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", query.id],
    queryFn: () => fetchData((query.id as string) ?? ""),
    enabled: !!query.id,
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
      rating: 0,
    },
  });

  async function onSubmit(dataComment: TSchema) {
    if (user?.role !== "admin") {
      const id = uuidv4();

      const comment = {
        id,
        name: user.fullname,
        text: dataComment.text,
        rating: dataComment.rating,
        photo_profile: user.photo_profile ? user.photo_profile : "",
        product_id: query.id as string,
      };

      const res = await commentServices.create(comment);
      if (res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["comments", query.id] });
        reset();
      }
    } else {
      toast.error("Only user or member can interact for this feature !");
      reset();
    }
  }

  if (isError) return <p>{error.message}</p>;

  return isLoading ? (
    <div className="w-full h-dvh flex items-center justify-center">
      <Loader className="text-black" />
    </div>
  ) : (
    <main className="md:grid flex flex-col gap-5 md:grid-cols-3 p-4 md:relative md:gap-3 pt-10 pb-24">
      <section className="md:col-span-1 flex flex-col md:sticky md:top-3 pb-8 gap-4 w-full h-fit">
        <article className="flex gap-2 items-center pb-5 border-b-2 border-b-slate-700">
          <picture>
            <source src={data?.product?.photo_product[0]} />
            <Image
              src={data?.product?.photo_product[0]}
              alt={data?.product?.name_product}
              width={200}
              height={200}
              priority
              className="w-[150px] h-[200px]"
            />
          </picture>
          <div className="grow flex flex-col gap-3">
            <h1 className="lg:text-lg text-sm">
              {data?.product?.name_product}
            </h1>
            <p className="text-gray-500 font-bold text-sm lg:text-md">
              {data?.product?.categories.label}
            </p>
            <div className="flex items-center gap-4">
              <Rating
                readOnly
                value={data?.totalRating ?? 0}
                style={{
                  maxWidth: 150,
                  marginBottom: ".5rem",
                  marginTop: ".5rem",
                }}
                itemStyles={myStyles}
              />
              <p className="text-lg">{data?.totalRating.toFixed(2)} of 5</p>
            </div>
          </div>
        </article>
        <div className="p-2 rounded-md flex lg:flex-row flex-col lg:gap-3 gap-4  ">
          <Image
            width={50}
            height={50}
            src={user?.photo_profile ? user.photo_profile : "/userdefault.png"}
            alt="profile"
            className="rounded-full block w-[50px] h-[50px]"
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grow w-full border-l-2 flex flex-col gap-4 border-l-slate-700"
          >
            <Controller
              control={control}
              name="rating"
              render={({ field: { onChange, value, onBlur } }) => (
                <Rating
                  value={value}
                  style={{
                    maxWidth: 150,
                    marginBottom: ".5rem",
                    marginTop: ".5rem",
                  }}
                  itemStyles={myStyles}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <textarea
              className="w-full h-56 resize-none outline-none p-2 text-sm"
              placeholder="Field this input to comment this product"
              {...register("text")}
            />
            <Button
              sizes="sm"
              className="text-white self-end"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Submit"}
            </Button>
          </form>
        </div>
      </section>
      <section className="col-span-2 flex flex-col gap-7 w-full pl-2 md:border-l-slate-700 md:border-l-2 pt-3">
        {data?.comments?.length > 0 ? (
          data?.comments?.map((comment: Comments, i: number) => {
            return (
              <motion.article
                key={comment.id}
                whileInView={{
                  scale: 1,
                  opacity: 1,
                  transformOrigin: "bottom center",
                }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="w-full pb-8 border-b-2 border-b-slate-700"
              >
                <div className="flex gap-3 items-center">
                  <Image
                    alt="User"
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
              </motion.article>
            );
          })
        ) : (
          <figure className="w-full h-dvh flex items-center justify-center flex-col gap-7">
            <Image
              alt="/noreviews.svg"
              src={"/noreviews.svg"}
              width={400}
              height={400}
            />
            <figcaption className="text-lg">
              No review, create your impression about this product
            </figcaption>
          </figure>
        )}
      </section>
    </main>
  );
}
