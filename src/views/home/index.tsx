import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { productsServices } from "@/services/products";
import { Product } from "@/types/product";
import Link from "next/link";
import Card from "@/components/Fragments/CardProduct";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { randomProduct } from "@/utils/randomProduct";

const testimonials = [
  {
    text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    date: new Date().toDateString(),
    title: "A Tale of Two Cities",
  },
  {
    text: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    date: new Date().toDateString(),
    title: "Hamlet",
  },
  {
    text: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    date: new Date().toDateString(),
    title: "A Dream Within a Dream",
  },
  {
    text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    date: new Date().toDateString(),
    title: "Pride and Prejudice",
  },
  {
    text: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    date: new Date().toDateString(),
    title: "Moby-Dick",
  },
];

const HomeView = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  async function fetchProducts() {
    const response = await productsServices.getProducts();
    const products = response.data.payload;
    const data = randomProduct(products, 5) as Product[];
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-[700px] hero"
        style={{
          backgroundImage: `url(/bg2.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <article className="max-w-layout mx-auto h-full flex justify-start items-center p-4">
          <div className="w-3/5 p-1">
            <TextGenerateEffect
              words="Buat semua kegiatan terlihat mudah dengan membeli semua keperluan
              di BShopp"
              className="md:text-4xl text-2xl"
            />
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-bold mt-5 text-white flex items-center gap-3 group px-6 rounded-full py-4 bg-blue-600"
              onClick={() => router.push("/products")}
            >
              Go to shop
              <i className="bx bx-right-arrow-alt text-xl font-semibold group-hover:text-3xl transition-all duration-300 ease-in-out" />
            </motion.button>
          </div>
        </article>
      </motion.div>
      <div className="max-w-layout mx-auto p-4 mt-8 pb-24">
        <div className="flex gap-3 items-center justify-between">
          <h1 className="text-2xl font-bold">Our products</h1>
          <Link
            href={"/products"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 ease-linear"
          >
            See More{" "}
            <i className="bx bx-right-arrow-alt text-xl font-semibold" />
          </Link>
        </div>
        <section className="grid grid-cols-2 md:grid-cols-5 w-full gap-4 mt-4">
          {products?.map((product) => {
            return (
              <Card
                key={product.id}
                product={product}
                width={600}
                height={500}
              />
            );
          })}
        </section>
      </div>
      <div className="mt-4 max-w-layout mx-auto p-4 pb-24">
        <h1 className="text-center text-2xl font-bold">
          Testimoni Customer Service
        </h1>
        <div className="mt-10">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeView;
