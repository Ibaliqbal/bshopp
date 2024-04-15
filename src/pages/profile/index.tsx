import ProfileView from "@/views/profile";
import Head from "next/head";
import React from "react";

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>BShopp | Profile</title>
        <meta name="description" content="profile user" />
      </Head>
      <section className="w-full">
        <ProfileView />
      </section>
    </>
  );
}
