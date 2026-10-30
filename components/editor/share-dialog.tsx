import { useRef } from "react"
import { Check, Link2, Mail, Trash2, User } from "lucide-react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Collaborator, ProjectOwner } from "@/types/collaborator"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Owners can invite, remove, and copy the link; collaborators only view. */
  canManage: boolean
  /** `null` until the list has loaded. */
  owner: ProjectOwner | null
  collaborators: Collaborator[]
  isLoading: boolean
  email: string
  onEmailChange: (email: string) => void
  canInvite: boolean
  isInviting: boolean
  /** The collaborator whose removal is in flight. */
  removingId: string | null
  error: string | null
  isCopied: boolean
  onInvite: () => void
  onRemove: (collaborator: Collaborator) => void
  onCopyLink: () => void
}

export function ShareDialog({
  open,
  onOpenChange,
  canManage,
  owner,
  collaborators,
  isLoading,
  email,
  onEmailChange,
  canInvite,
  isInviting,
  removingId,
  error,
  isCopied,
  onInvite,
  onRemove,
  onCopyLink,
}: ShareDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      error={error}
      className="sm:max-w-lg"
      title="Share project"
      description={
        canManage
          ? "Invite collaborators, copy the workspace link, and manage access."
          : "See who has access to this workspace. Only the owner can manage access."
      }
      initialFocus={canManage ? inputRef : undefined}
    >
      <hr className="-mx-6 border-surface-border" />

      {canManage && (
        <section className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface/60 p-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-copy-primary">
              Workspace link
            </h3>
            <p className="mt-1 text-xs text-copy-muted">
              Share a direct link with teammates after you grant them access.
            </p>
          </div>
          <Button variant="outline" className="shrink-0" onClick={onCopyLink}>
            {isCopied ? (
              <Check className="size-4" data-icon="inline-start" />
            ) : (
              <Link2 className="size-4" data-icon="inline-start" />
            )}
            {isCopied ? "Copied!" : "Copy link"}
          </Button>
        </section>
      )}

      {canManage && (
        <form
          className="flex items-center gap-2 rounded-2xl border border-surface-border bg-surface/60 p-3"
          onSubmit={(event) => {
            event.preventDefault()
            onInvite()
          }}
        >
          <div className="relative min-w-0 flex-1">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-copy-muted" />
            <Input
              ref={inputRef}
              type="email"
              aria-label="Email address"
              placeholder="teammate@company.com"
              value={email}
              autoComplete="off"
              disabled={isInviting}
              className="h-10 rounded-xl pl-9"
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </div>
          <Button type="submit" size="lg" disabled={!canInvite}>
            {isInviting ? "Inviting…" : "Invite"}
          </Button>
        </form>
      )}

      <section
        aria-labelledby="share-people-heading"
        className="flex flex-col gap-3"
      >
        <div className="flex items-baseline justify-between gap-2">
          <h3
            id="share-people-heading"
            className="text-sm font-medium text-copy-primary"
          >
            People with access
          </h3>
          {owner && (
            <span className="text-xs text-copy-muted">
              {collaborators.length + 1} total
            </span>
          )}
        </div>
        {owner ? (
          <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            <PersonItem
              name={owner.name ?? owner.email ?? "Project owner"}
              email={owner.email}
              imageUrl={owner.imageUrl}
              role="owner"
            />
            {collaborators.map((collaborator) => (
              <PersonItem
                key={collaborator.id}
                // Without a Clerk profile, the email stands in for the name.
                name={collaborator.name ?? collaborator.email}
                email={collaborator.email}
                imageUrl={collaborator.imageUrl}
                role="collaborator"
                removeLabel={`Remove ${collaborator.email}`}
                isRemoveDisabled={removingId !== null || isInviting}
                onRemove={canManage ? () => onRemove(collaborator) : undefined}
              />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-surface-border py-8 text-center text-sm text-copy-muted">
            {isLoading
              ? "Loading people…"
              : "Couldn’t load people with access."}
          </p>
        )}
      </section>
    </EditorDialog>
  )
}

interface PersonItemProps {
  name: string
  email: string | null
  imageUrl: string | null
  role: "owner" | "collaborator"
  removeLabel?: string
  isRemoveDisabled?: boolean
  /** Omit to hide the remove action (the owner, or a collaborator viewing). */
  onRemove?: () => void
}

function PersonItem({
  name,
  email,
  imageUrl,
  role,
  removeLabel,
  isRemoveDisabled,
  onRemove,
}: PersonItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface/60 px-4 py-3">
      <Avatar size="lg">
        {imageUrl && <AvatarImage src={imageUrl} alt="" />}
        <AvatarFallback className="bg-ai/20 text-ai-text">
          <User className="size-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-copy-primary">
            {name}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[0.625rem] font-medium tracking-[0.2em] uppercase",
              role === "owner"
                ? "border-brand/30 bg-accent-dim text-brand"
                : "border-surface-border text-copy-muted"
            )}
          >
            {role}
          </span>
        </div>
        {email && (
          <span className="truncate text-xs text-copy-muted">{email}</span>
        )}
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={removeLabel}
          className="text-error hover:bg-error/10 hover:text-error"
          disabled={isRemoveDisabled}
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </li>
  )
}
