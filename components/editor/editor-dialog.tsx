import type { ReactNode, RefObject } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Action buttons, rendered right-aligned in the footer bar. */
  footer?: ReactNode
  /** Element to focus on open. Defaults to the first tabbable element. */
  initialFocus?: RefObject<HTMLElement | null>
  /** Failure message, shown above the footer. */
  error?: string | null
  children?: ReactNode
}

/** Themed dialog shell shared by every editor dialog. */
export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  initialFocus,
  error,
  children,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        initialFocus={initialFocus}
        className="gap-5 rounded-3xl bg-elevated/95 p-6 text-copy-primary ring-surface-border backdrop-blur-md sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-copy-muted">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
        {footer && (
          <DialogFooter className="-mx-6 -mb-6 rounded-b-3xl border-surface-border bg-surface/60 px-6 py-4">
            {footer}
          </DialogFooter>
        )}
        {/* Own close button: the built-in one is offset for the default radius. */}
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
            />
          }
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
