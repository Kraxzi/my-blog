FROM node:18.16.1 as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node/

RUN npm ci \
    && npm run test \
    && npm run build \
    && npm prune --production

# ---

FROM node:18.16.1

ENV NODE_ENV production

WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/main.js"]