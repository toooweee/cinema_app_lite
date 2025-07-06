FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl netcat-openbsd

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma/

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY . .

RUN npx prisma generate

RUN npm run build

RUN mkdir -p uploads

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"] 