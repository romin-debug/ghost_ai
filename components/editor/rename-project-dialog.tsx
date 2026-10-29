import { useRef } from "react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FORM_ID = "rename-project-form"

interface RenameProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  name: string
  onNameChange: (name: string) => void
  canSubmit: boolean
  isSubmitting: boolean
  error: string | null
  onSubmit: () => void
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  currentName,
  name,
  onNameChange,
  canSubmit,
  isSubmitting,
  error,
  onSubmit,
}: RenameProjectDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      error={error}
      title="Rename project"
      description={`Enter a new name for “${currentName}”.`}
      initialFocus={inputRef}
      footer={
        <>
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!canSubmit}>
            {isSubmitting ? "Saving…" : "Rename"}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <label
          htmlFor="rename-project-name"
          className="text-sm font-medium text-copy-secondary"
        >
          Project name
        </label>
        <Input
          ref={inputRef}
          id="rename-project-name"
          value={name}
          autoComplete="off"
          disabled={isSubmitting}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </form>
    </EditorDialog>
  )
}
