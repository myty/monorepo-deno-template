FROM node:lts as source

RUN npm install --global pnpm

WORKDIR /src

# copy files
COPY packages/ packages/
COPY package.json .
COPY pnpm-*.yaml .
COPY turbo.json .
COPY deno.jsonc .
COPY apps/api/package.json apps/api/

RUN pnpm i --frozen-lockfile

COPY apps/api/ apps/api/

# Step 2 - Build the app
FROM denoland/deno:alpine-1.19.2 as build

WORKDIR /src
COPY --from=source /src/ .

RUN deno bundle apps/api/main.ts output.bundle.js

# Step 3 - Just the exectuable file
FROM denoland/deno:alpine-1.19.2

# The port that your application listens to.
EXPOSE 3000

WORKDIR /app
COPY --from=build /src/output.bundle.js .

# Prefer not to run as root.
USER deno

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "output.bundle.js"]