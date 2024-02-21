ARG NODE_IMAGE=node:20.4.0-alpine3.18
FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production --ignore-ts-errors

FROM base AS production
ENV NODE_ENV=development
ENV PORT=3333
ENV HOST=0.0.0.0
ENV DB_CONNECTION=sqlite
ENV APP_KEY=562bDLIwef1IVyqbEMwXlbuyUI1H1lYm
ENV DRIVE_DISK=local
ENV DB_FILEPATH=./tmp/database.sqlite
ENV NUCLEO_LEILOES_API_URL = "https://api.nucleoleiloes.com.br/imovel/filtro"
ENV VIVA_REAL_API_URL = "https://glue-api.vivareal.com/v2/listings"
ENV VIVA_REAL_SITE_URL = "https://www.vivareal.com.br"

COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
COPY --chown=node:node migration-run.sh /home/node/app/migration-run.sh
RUN chmod +x /home/node/app/migration-run.sh
EXPOSE $PORT

CMD ["/bin/sh", "-c", "/home/node/app/migration-run.sh && dumb-init node server.js"]
