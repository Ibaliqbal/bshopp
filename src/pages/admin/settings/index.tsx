import AdminSettingsView from "@/views/admin/Settings";
import Head from "next/head";
import React from "react";

export default function AdminSettingPage() {
  return (
    <section className="w-full min-h-dvh">
      <Head>
        <title>BShopp | Admin</title>
      </Head>
      <AdminSettingsView />
    </section>
  );
}
