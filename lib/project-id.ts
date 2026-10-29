import { slugify } from "@/lib/slug"

/**
 * Project IDs double as Liveblocks room IDs: a slug of the name plus a short
 * random suffix, e.g. "payments-platform-k3x9q2".
 */
export const PROJECT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const MAX_PROJECT_ID_LENGTH = 64

const MAX_SLUG_LENGTH = 48
const SUFFIX_LENGTH = 6
const SUFFIX_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

export function createProjectIdSuffix(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SUFFIX_LENGTH))
  return Array.from(
    bytes,
    (byte) => SUFFIX_ALPHABET[byte % SUFFIX_ALPHABET.length]
  ).join("")
}

/** Returns an empty string when the name has no slug-able characters. */
export function toProjectId(name: string, suffix: string): string {
  const slug = slugify(name).slice(0, MAX_SLUG_LENGTH).replace(/-+$/, "")
  return slug ? `${slug}-${suffix}` : ""
}

export function isValidProjectId(id: string): boolean {
  return id.length <= MAX_PROJECT_ID_LENGTH && PROJECT_ID_PATTERN.test(id)
}
