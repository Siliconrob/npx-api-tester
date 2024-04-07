ARG NODE_VERSION=20.10.0
ARG ALPINE_VERSION=3.19

FROM node:${NODE_VERSION}-alpine AS node

FROM alpine:${ALPINE_VERSION}

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN node -v

RUN npm install -g yarn --force

RUN yarn -v

WORKDIR /src

ADD ./ /src

EXPOSE 3000

CMD ["node", "index.js"]