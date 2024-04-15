import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import withAuth from "./middleware/withAuth";

export function MainMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  return res;
}

export default withAuth(MainMiddleware, [
  "/profile",
  "/admin",
  "/products/create_product",
]);
