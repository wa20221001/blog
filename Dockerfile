ARG NODE_IMAGE=cgr.dev/chainguard/node:latest-dev
FROM ${NODE_IMAGE} AS verify

WORKDIR /workspace
USER 65532

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

RUN pnpm install --frozen-lockfile
RUN pnpm test:ci
RUN pnpm lint
RUN pnpm build

FROM scratch AS static-export
COPY --from=verify /workspace/out /
