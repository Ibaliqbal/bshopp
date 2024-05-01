import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import withAuth, { onlyAdmin, onlyMember } from "./middleware/withAuth";

export function MainMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  return res;
}

export default withAuth(MainMiddleware, [...onlyAdmin, ...onlyMember]);
