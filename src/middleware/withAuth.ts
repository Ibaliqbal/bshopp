import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

export const onlyAdmin = [
  "/admin",
  "/admin/products",
  "/admin/settings",
  "/admin/users",
  "/products/create_product",
];

export const onlyMember = [
  "/profile",
  "/profile/cart",
  "/profile/favorite",
  "/profile/order",
];

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    if (requireAuth.includes(pathname)) {
      const token = await getToken({
        secret: process.env.NEXTAUTH_SECRET,
        req,
      });
      if (!token) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }

      if (token.role !== "admin" && onlyAdmin.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (token.role !== "member" && onlyMember.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return middleware(req, next);
  };
}
