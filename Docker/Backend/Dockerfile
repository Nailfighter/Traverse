FROM node:22-alpine

WORKDIR /server

COPY Backend/package*.json ./
RUN npm ci --omit=dev

COPY Backend/ .

EXPOSE 3000

CMD ["node", "server.js"]
