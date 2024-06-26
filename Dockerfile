FROM node:18 AS builder

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY prisma /app

RUN yarn install

COPY . /app

FROM node:18 AS development

WORKDIR /app

COPY --from=builder /app ./
COPY .env .env
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

EXPOSE 3000

CMD ["/app/wait-for-it.sh", "db:5432", "--", "sh", "-c", "yarn prisma migrate deploy && yarn prisma generate && yarn dev"]


FROM node:18 AS production

WORKDIR /app

COPY --from=builder /app ./
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

RUN yarn install --production

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma migrate deploy && yarn prisma generate"]