FROM node:20.11.1-bullseye

RUN npx -y playwright@1.51.0 install --with-deps
