<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# StudyOS Agent Instructions

You are working on StudyOS, a personal study management web app for one user.

## Non-negotiable goals
- Keep the app simple, modular, and maintainable.
- Never rewrite unrelated code.
- Never add features unless explicitly requested.
- Prefer small, testable changes.
- Preserve existing behavior unless the task says otherwise.

## Tech stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase
- Gemini API

## Working style
- Before coding, explain the plan briefly.
- Make one focused change at a time.
- If a change touches multiple files, keep it minimal and justified.
- Use reusable components.
- Avoid duplicate logic.
- Keep types strict.
- Keep UI clean and responsive.

## Project structure
- `src/app/` for routes and pages
- `src/components/` for shared UI
- `src/features/` for feature-specific logic
- `src/lib/` for helpers
- `src/services/` for API and Firebase logic
- `src/types/` for shared types
- `src/constants/` for constants

## Rules for new work
- Build the smallest useful version first.
- Add loading, empty, and error states.
- Use clear naming.
- Do not hardcode secrets.
- Do not create unnecessary abstractions.
- Do not introduce new libraries unless clearly needed.

## Before finishing
- Check for type errors.
- Check for obvious runtime issues.
- Summarize what changed.
- State any risks or missing pieces.

<!-- END:nextjs-agent-rules -->
