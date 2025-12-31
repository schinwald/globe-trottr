import { headers } from "next/headers"

export const setURL = (headers: Headers, url: string) => {
  headers.set("x-url", url)
}

export const getURL = () => {
  const requestHeaders = headers()
  const url = requestHeaders.get("x-url")
  return url
}

export const redirectToHomepage = (roomCode?: string) => {
  if (roomCode) {
    return `/?roomCode=${roomCode}`
  } else {
    return "/"
  }
}
