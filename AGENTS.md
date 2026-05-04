# AGENTS.md

Instructions for AI agents working on this repository.

## Workflow

1. Create a new branch for each change
2. Make changes and commit them
3. Push the branch to origin
4. Create a pull request against `main`
5. Wait for the user to approve before merging

## Commands

All Node.js / pnpm commands MUST run inside a Chainguard Docker container. Do NOT run
`pnpm`, `node`, `npm`, or `npx` on the host system. The two exceptions are `go` and
the `gh` CLI.

The container image is `cgr.dev/chainguard/node:latest-dev` (defined in the
Dockerfile). Build the `deps` stage first and tag it as `blog-dev`, then run
individual commands:

```bash
docker build --target deps -t blog-dev .
docker run --rm -v "$PWD/src:/workspace/src" -v "$PWD/content:/workspace/content" blog-dev pnpm lint
docker run --rm -v "$PWD/src:/workspace/src" -v "$PWD/content:/workspace/content" blog-dev pnpm test:ci
docker run --rm blog-dev pnpm typecheck
docker run --rm blog-dev pnpm build
```

After making changes to source or config files, rebuild the dev image:
```bash
docker build --target deps -t blog-dev .
```

To run the full CI pipeline as a single build (lint, test, build):
```bash
docker build --target verify .
```

## Notes

- The blog uses Next.js with `output: "export"` (static HTML output)
- Deployed to GitHub Pages at `/blog` basePath
- Content lives in `content/posts/` as MDX files
- Never force push to `main` — always use feature branches + PRs
- Use Chainguard containers for all Node.js tooling
