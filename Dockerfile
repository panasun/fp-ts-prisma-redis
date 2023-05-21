FROM node:18-slim as prisma-client
WORKDIR /usr/src/app
COPY package.json package.json
COPY prisma prisma
RUN yarn
RUN yarn prisma:generate

FROM node:18-slim as builder
WORKDIR /usr/src/app
COPY . .
COPY --from=prisma-client /usr/src/app/prisma/client /usr/src/app/prisma/client
RUN yarn set version 3.5
RUN yarn plugin import workspace-tools && \
  yarn workspaces focus --production
RUN  yarn run build

FROM node:18-slim as runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/.yarn ./.yarn
COPY --from=builder /usr/src/app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /usr/src/app/.pnp.cjs ./.pnp.cjs
COPY --from=builder /usr/src/app/.pnp.loader.mjs ./.pnp.loader.mjs

RUN yarn set version 3.5

ENTRYPOINT ["yarn", "run", "start"]
