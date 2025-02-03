import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Dohvati sesiju
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Dozvoli pristup stranicama za pozivnice i postavljanje šifre
  const publicPaths = ["/invite", "/set-password"];
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return response;
  }

  // Ako korisnik nije autentificiran i pokušava pristupiti zaštićenoj ruti
  if (!session) {
    // Preusmjeri na login stranicu
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

// Definirajte koje rute trebaju biti zaštićene
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (auth routes)
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!auth|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
