import type { Appearance } from "@clerk/ui"
import { dark } from "@clerk/ui/themes"

export const authAppearance: Appearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorNeutral: "var(--text-primary)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--accent-primary-dim)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyMono: "var(--font-geist-mono)",
    fontSize: "0.875rem",
    borderRadius: "var(--radius)",
  },
}
