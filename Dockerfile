ARG NODE_IMAGE=cgr.dev/chainguard/node:latest-dev
FROM ${NODE_IMAGE} AS deps

# Refresh the same Chainguard Node package before any dependency downloads.
USER 0
RUN apk add --no-cache --upgrade nodejs-26=26.12.1-r0

USER 65532
WORKDIR /workspace

ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/tmp/pnpm
ENV PNPM_STORE_DIR=/tmp/pnpm-store
ENV PATH="${PNPM_HOME}:${PATH}"

COPY --chown=65532:65532 package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=65532:65532 eslint.config.mjs next.config.ts postcss.config.mjs tailwind.config.ts tsconfig.json vitest.config.ts vitest.setup.ts ./
COPY --chown=65532:65532 next-env.d.ts ./
COPY --chown=65532:65532 src ./src
COPY --chown=65532:65532 content ./content
COPY --chown=65532:65532 public ./public
COPY --chown=65532:65532 scripts ./scripts
COPY --chown=65532:65532 AGENTS.md ./
COPY --chown=65532:65532 patches ./patches

RUN pnpm install --frozen-lockfile

FROM deps AS verify
RUN pnpm test:ci
RUN pnpm lint
RUN pnpm build

FROM scratch AS static-export
COPY --from=verify /workspace/out /
