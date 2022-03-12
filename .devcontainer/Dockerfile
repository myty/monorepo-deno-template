ARG DENO_VERSION=1.19.2
ARG PNPM_VERSION=6.32.3

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT=16-bullseye

FROM denoland/deno:bin-${DENO_VERSION} as deno
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g pnpm"
WORKDIR /home/node
RUN mkdir ./.cache
WORKDIR /home/node/.cache

# Add Deno
COPY --from=deno /deno /usr/local/bin/deno
RUN mkdir deno
RUN chown :1000 ./deno
RUN chmod 775 ./deno
RUN chmod g+s ./deno

# Add PNPM
ENV PNPM_VERSION ${PNPM_VERSION}
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node
RUN mkdir pnpm
RUN chown :1000 ./pnpm
RUN chmod 775 ./pnpm
RUN chmod g+s ./pnpm
RUN echo "store-dir=/home/node/.cache/pnpm" >> /home/node/.npmrc