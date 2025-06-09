FROM oven/bun:1.2.15-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY src ./

RUN bun install
RUN bun build --minify --target=bun *.ts --outdir dist


FROM oven/bun:1.2.15-alpine

WORKDIR /app

COPY --from=builder /app/dist ./

CMD ["bun", "cluster.js"]
