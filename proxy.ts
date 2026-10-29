import { clerkMiddleware } from "@clerk/nextjs/server"

import { apiError } from "@/lib/api"

const publicRoutes = [
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
].filter((route): route is string => Boolean(route))

function isPublicRoute(pathname: string) {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

function isApiRoute(pathname: string) {
  return /^\/(api|trpc)(\/|$)/.test(pathname)
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  if (isPublicRoute(pathname)) {
    return
  }

  // `auth.protect()` answers signed-out API calls with a 404 or a sign-in
  // redirect, so API routes get a 401 instead.
  if (isApiRoute(pathname)) {
    const { userId } = await auth()

    if (!userId) {
      return apiError(401, "Unauthorized")
    }

    return
  }

  await auth.protect()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
