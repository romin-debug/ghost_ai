import { useEffect, useRef, useState } from "react"

import { readApiError } from "@/lib/api"
import type {
  Collaborator,
  ProjectOwner,
  ProjectPeople,
} from "@/types/collaborator"

const NETWORK_ERROR = "Couldn’t reach the server. Check your connection."
const COPIED_FEEDBACK_MS = 2000

function isProjectPeople(body: unknown): body is ProjectPeople {
  return (
    typeof body === "object" &&
    body !== null &&
    "owner" in body &&
    typeof body.owner === "object" &&
    body.owner !== null &&
    "collaborators" in body &&
    Array.isArray(body.collaborators)
  )
}

function isCollaboratorBody(
  body: unknown
): body is { collaborator: Collaborator } {
  return (
    typeof body === "object" &&
    body !== null &&
    "collaborator" in body &&
    typeof body.collaborator === "object" &&
    body.collaborator !== null
  )
}

/**
 * Open state, people list (owner + collaborators), invite/remove requests, and copy-link
 * feedback for the workspace share dialog. Ownership is enforced by the API;
 * the dialog only hides the controls for collaborators.
 */
export function useShareDialog(projectId: string | undefined) {
  const [isOpen, setIsOpen] = useState(false)
  const [owner, setOwner] = useState<ProjectOwner | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  // Ignores a list response that a newer load has superseded.
  const loadIdRef = useRef(0)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
    }
  }, [])

  const collaboratorsUrl = projectId
    ? `/api/projects/${encodeURIComponent(projectId)}/collaborators`
    : null
  const isBusy = isInviting || removingId !== null
  const canInvite = email.trim().length > 0 && !isBusy

  async function loadCollaborators(url: string) {
    const loadId = ++loadIdRef.current
    setIsLoading(true)
    try {
      const response = await fetch(url)
      if (loadId !== loadIdRef.current) return
      if (!response.ok) {
        setError(await readApiError(response))
        return
      }
      const body: unknown = await response.json()
      if (loadId !== loadIdRef.current) return
      if (isProjectPeople(body)) {
        setOwner(body.owner)
        setCollaborators(body.collaborators)
      }
    } catch {
      if (loadId === loadIdRef.current) setError(NETWORK_ERROR)
    } finally {
      if (loadId === loadIdRef.current) setIsLoading(false)
    }
  }

  function openShareDialog() {
    if (!collaboratorsUrl) return
    // Reloaded on every open, so the list never shows another room's entries.
    setOwner(null)
    setCollaborators([])
    setEmail("")
    setError(null)
    setIsOpen(true)
    void loadCollaborators(collaboratorsUrl)
  }

  function closeShareDialog() {
    if (isBusy) return
    setIsOpen(false)
  }

  function updateEmail(value: string) {
    setEmail(value)
    setError(null)
  }

  async function inviteCollaborator() {
    if (!canInvite || !collaboratorsUrl) return
    setIsInviting(true)
    setError(null)
    try {
      const response = await fetch(collaboratorsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!response.ok) {
        setError(await readApiError(response))
        return
      }
      const body: unknown = await response.json()
      if (isCollaboratorBody(body)) {
        setCollaborators((current) => [...current, body.collaborator])
      }
      setEmail("")
    } catch {
      setError(NETWORK_ERROR)
    } finally {
      setIsInviting(false)
    }
  }

  async function removeCollaborator(collaborator: Collaborator) {
    if (isBusy || !collaboratorsUrl) return
    setRemovingId(collaborator.id)
    setError(null)
    try {
      const response = await fetch(
        `${collaboratorsUrl}/${encodeURIComponent(collaborator.id)}`,
        { method: "DELETE" }
      )
      if (!response.ok) {
        setError(await readApiError(response))
        return
      }
      setCollaborators((current) =>
        current.filter(({ id }) => id !== collaborator.id)
      )
    } catch {
      setError(NETWORK_ERROR)
    } finally {
      setRemovingId(null)
    }
  }

  async function copyProjectLink() {
    if (!projectId) return
    const link = `${window.location.origin}/editor/${encodeURIComponent(projectId)}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      setError("Couldn’t copy the link. Copy it from the address bar instead.")
      return
    }
    setIsCopied(true)
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
    copiedTimerRef.current = setTimeout(
      () => setIsCopied(false),
      COPIED_FEEDBACK_MS
    )
  }

  return {
    isOpen,
    owner,
    collaborators,
    isLoading,
    email,
    setEmail: updateEmail,
    canInvite,
    isInviting,
    removingId,
    error,
    isCopied,
    openShareDialog,
    closeShareDialog,
    inviteCollaborator,
    removeCollaborator,
    copyProjectLink,
  }
}
