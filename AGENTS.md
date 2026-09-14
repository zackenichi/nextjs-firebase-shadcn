<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project UI conventions

- Use the installed shadcn/ui components whenever an appropriate component exists; keep native HTML for semantic structure.
- Every interactive link, button, and button-like control must show a pointer cursor. Disabled controls must show a not-allowed cursor. These defaults are enforced globally in `src/app/globals.css`; preserve them when adding or updating components.
- Use the installed Progress component for route loading and background operations so interactions always provide immediate feedback. Use indeterminate progress when the operation does not expose a meaningful percentage.
- Mount the Sonner `Toaster` once in the root layout. Use Sonner success and error toasts for the outcomes of user-initiated asynchronous actions, especially authentication and database operations; keep inline messages when they provide actionable form context.
