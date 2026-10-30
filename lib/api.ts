import type { ProjectAccess } from "@/lib/projects"

/** Error body returned by every API route. */
export interface ApiErrorBody {
  error: string
}

export function apiError(status: number, message: string): Response {
  return Response.json({ error: message } satisfies ApiErrorBody, { status })
}

/** Maps a failed owner check to its response, or `null` for the owner. */
export function projectAccessError(access: ProjectAccess): Response | null {
  switch (access) {
    case "owner":
      return null
    case "forbidden":
      return apiError(403, "Only the project owner can do this.")
    case "not-found":
      return apiError(404, "Project not found.")
  }
}

export type JsonBodyResult = { ok: true; body: unknown } | { ok: false }

/**
 * Reads a JSON request body. An empty body parses as `undefined`, so routes
 * with optional input can accept bodiless requests.
 */
export async function readJsonBody(request: Request): Promise<JsonBodyResult> {
  const text = await request.text()

  if (!text.trim()) {
    return { ok: true, body: undefined }
  }

  try {
    return { ok: true, body: JSON.parse(text) as unknown }
  } catch {
    return { ok: false }
  }
}

const FALLBACK_ERROR = "Something went wrong. Please try again."

/** Client-side: the `error` message from a failed API response. */
export async function readApiError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json()
    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
    ) {
      return body.error
    }
  } catch {
    // Not JSON; fall through.
  }
  return FALLBACK_ERROR
}
