import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (!token || token.role !== "admin") {
        const loginUrl = new URL("/admin/login", req.url)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true
    }
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}