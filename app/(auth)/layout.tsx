import type { ReactNode } from "react"

import { AuthBrandPanel } from "@/components/auth/auth-brand-panel"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-1 bg-base">
      <AuthBrandPanel />
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </div>
  )
}
