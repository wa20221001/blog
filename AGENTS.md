# AGENTS.md

Instructions for AI agents working on this repository.

## Workflow

1. Create a new branch for each change
2. Make changes and commit them
3. Push the branch to origin
4. Create a pull request against `main`
5. Wait for the user to approve before merging

## Commands

- `pnpm lint` - Run ESLint
- `pnpm test` - Run Vitest
- `pnpm test:ci` - Run Vitest (CI mode)
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm build` - Build the static site

## Notes

- The blog uses Next.js with `output: "export"` (static HTML output)
- Deployed to GitHub Pages at `/blog` basePath
- Content lives in `content/posts/` as MDX files
- Never force push to `main` — always use feature branches + PRs
