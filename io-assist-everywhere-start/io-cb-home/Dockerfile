FROM node:20-alpine AS builder

ARG VITE_DEMO_SERVER_BASE_ORIGIN
ARG VITE_LICENSE_KEY
ARG VITE_PPT_SAVE_DIR
ARG VITE_IO_INTELLIGENCE_LICENSE_KEY

WORKDIR /home/node/app

COPY package*.json lerna.json ./

COPY ./dev-apps/d-io-cb-home/package.json ./dev-apps/d-io-cb-home/package.json

COPY ./libs ./libs

RUN npm ci

COPY ./configs ./configs
COPY ./dev-apps/d-io-cb-home/public ./dev-apps/d-io-cb-home/public
COPY ./dev-apps/d-io-cb-home/scripts ./dev-apps/d-io-cb-home/scripts
COPY ./dev-apps/d-io-cb-home/src ./dev-apps/d-io-cb-home/src
COPY ./dev-apps/d-io-cb-home/index.html ./dev-apps/d-io-cb-home/index.html
COPY ./dev-apps/d-io-cb-home/tsconfig.app.json ./dev-apps/d-io-cb-home/tsconfig.app.json
COPY ./dev-apps/d-io-cb-home/tsconfig.json ./dev-apps/d-io-cb-home/tsconfig.json
COPY ./dev-apps/d-io-cb-home/tsconfig.node.json ./dev-apps/d-io-cb-home/tsconfig.node.json
COPY ./dev-apps/d-io-cb-home/vite.config.ts ./dev-apps/d-io-cb-home/vite.config.ts

RUN npm run build:docker

FROM nginxinc/nginx-unprivileged

COPY --from=builder --chown=nginx:nginx /home/node/app/dev-apps/d-io-cb-home/dist /usr/share/nginx/html

EXPOSE 8080