import type { Project } from "@/types/project"

/** Placeholder data until projects are persisted. */
export const mockProjects: Project[] = [
  {
    id: "mock-1",
    name: "Payments Platform",
    slug: "payments-platform",
    role: "owner",
  },
  {
    id: "mock-2",
    name: "Realtime Chat Service",
    slug: "realtime-chat-service",
    role: "owner",
  },
  {
    id: "mock-3",
    name: "Analytics Pipeline",
    slug: "analytics-pipeline",
    role: "collaborator",
  },
]
