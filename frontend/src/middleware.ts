import { type NextRequest, NextResponse } from "next/server"
import { match } from "path-to-regexp"

export function middleware(request: NextRequest) {
  const isAuthorized = request.cookies.get("auth")

  const { pathname } = request.nextUrl

  if (!isAuthorized) {
    if (match("/lobby/:roomCode")(pathname)) {
      const { params } = match("/lobby/:roomCode")(pathname)
      return NextResponse.redirect(
        new URL(`/?roomCode=${params.roomCode}`, request.url)
      )
    }
  }
}
