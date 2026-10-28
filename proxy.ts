import { clerkMiddleware } from "@clerk/nextjs/server"

const publicRoutes = [
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
].filter((route): route is string => Boolean(route))

function isPublicRoute(pathname: string) {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req.nextUrl.pathname)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
