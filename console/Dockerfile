FROM node:10-alpine

RUN apk add --no-cache git

WORKDIR /app
ENV NODE_ENV production

ADD . .
RUN npm install

ENTRYPOINT ["node", "console.js"]
