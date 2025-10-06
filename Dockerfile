FROM docker.io/oven/bun:alpine AS build

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
RUN bun install --production

COPY . .

RUN bun run build

FROM docker.io/library/busybox:1.36

WORKDIR /www
COPY --from=build /app/dist .

EXPOSE 80

CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
