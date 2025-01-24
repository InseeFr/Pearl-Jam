FROM node:20.11.1-bullseye

RUN npx -y playwright@v1.49.1 install --with-deps
