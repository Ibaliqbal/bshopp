import FavoriteView from "@/views/profile/Favorite";
import Head from "next/head";
import React from "react";

export default function FavoritePage() {
  return (
    <>
      <Head>
        <title>BShopp | Favorite</title>
        <meta name="description" content="favorite products user" />
      </Head>
      <section className="w-full">
        <FavoriteView />
      </section>
    </>
  );
}
