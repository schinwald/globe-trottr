import { type NextRequest, NextResponse } from "next/server"
import { setURL } from "./utils/server/redirects"

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  setURL(headers, request.url)

  return NextResponse.next({
    request: {
      headers,
    },
  })
}
