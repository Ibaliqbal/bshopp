import { useRouter } from "next/router";
import React from "react";

export default function CommentProductPage() {
  const { query } = useRouter();
  console.log(query);
  return <div>Hai</div>;
}
