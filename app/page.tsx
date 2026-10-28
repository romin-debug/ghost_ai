import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

export default function Home() {
  return (
    <Suspense>
      <HomeRedirect />
    </Suspense>
  )
}

async function HomeRedirect() {
  const { isAuthenticated, redirectToSignIn } = await auth()

  if (!isAuthenticated) {
    return redirectToSignIn()
  }

  redirect("/editor")
}
