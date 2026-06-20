import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Next.js 16: proxy.ts replaces middleware.ts.
// Per Next.js 16 guidance, we only check for the EXISTENCE of a session
// cookie here (cheap, no DB/crypto calls). The actual role check
// (role === "admin") happens server-side in app/admin/layout.tsx.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
}