import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FORM_ID = "create-project-form"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onNameChange: (name: string) => void
  /** Preview of the new project's ID, which is also its room ID. */
  roomId: string
  canSubmit: boolean
  isSubmitting: boolean
  error: string | null
  onSubmit: () => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  roomId,
  canSubmit,
  isSubmitting,
  error,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      error={error}
      title="Create project"
      description="Start a new architecture workspace."
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
            {isSubmitting ? "Creating…" : "Create project"}
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
          htmlFor="create-project-name"
          className="text-sm font-medium text-copy-secondary"
        >
          Project name
        </label>
        <Input
          id="create-project-name"
          value={name}
          placeholder="e.g. Payments Platform"
          autoComplete="off"
          disabled={isSubmitting}
          onChange={(event) => onNameChange(event.target.value)}
        />
        <p className="text-xs text-copy-muted">
          Room ID:{" "}
          <span className="font-mono break-all text-copy-secondary">
            {roomId || "project-name"}
          </span>
        </p>
      </form>
    </EditorDialog>
  )
}
