import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST with header `x-revalidate-secret: <REVALIDATE_SECRET>`
 * Invalidates cached Google Sheet fetches tagged `homepage` and `products`.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag("homepage", "max");
  revalidateTag("products", "max");

  return NextResponse.json({
    ok: true,
    revalidated: ["homepage", "products"],
  });
}
