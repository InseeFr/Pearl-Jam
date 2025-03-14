FROM node:20.11.1-bullseye

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

RUN npx playwright install --with-deps chromium