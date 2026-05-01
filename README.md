# Scott Blog

Public MDX blog and resume for `wa20221001/blog`, exported as a static Next.js site for GitHub Pages.

## Local verification

Do not install Node, pnpm, or package dependencies on the workstation OS. Run the blog toolchain in Docker:

```sh
docker build --build-arg NODE_IMAGE=cgr.dev/chainguard/node:latest-dev -t wa20221001-blog-check .
```

The public Chainguard starter image exposes `cgr.dev/chainguard/node:latest-dev`. If you have access to a private pinned Chainguard image, prefer a Node dev tag compatible with Next.js 16 and pass it as `NODE_IMAGE`.

The image needs Node.js 24, a shell, and Corepack/pnpm-compatible package tooling. Chainguard's non-dev/slim Node images are better runtime images, but they are not suitable for this build-check container because static export requires installing dependencies and running shell-based package scripts.

## Publishing

This repository is intended for GitHub Pages at:

```text
https://wa20221001.github.io/blog/
```

Do not push or enable Pages until the generated static output has been manually inspected.

The GitHub Pages workflow regenerates resume PDFs from `content/resume/*.mdx` before building the static site. The deployed download links always use the PDFs generated during that workflow run.

## Cloudflare later

GitHub Pages is the first host. Cloudflare can be added later as DNS in front of GitHub Pages, or the static export can be moved to Cloudflare Pages/R2. If a custom domain serves this site at the domain root, update `next.config.ts` to remove the `/blog` `basePath` before publishing that domain.
