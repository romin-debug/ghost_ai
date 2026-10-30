import { type ParseResult, isRecord } from "@/lib/project-input"

const MAX_EMAIL_LENGTH = 254
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface InviteCollaboratorInput {
  /** Trimmed and lowercased. */
  email: string
}

export function parseInviteCollaboratorInput(
  body: unknown
): ParseResult<InviteCollaboratorInput> {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object." }
  }

  const { email } = body

  if (typeof email !== "string") {
    return { ok: false, error: "`email` must be a string." }
  }

  const normalized = email.trim().toLowerCase()

  if (normalized.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(normalized)) {
    return { ok: false, error: "Enter a valid email address." }
  }

  return { ok: true, data: { email: normalized } }
}
