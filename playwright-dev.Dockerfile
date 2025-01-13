FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /app

COPY package.json .

COPY yarn.lock .



RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

VOLUME /app/src

RUN ulimit 65000 
RUN sysctl fs.inotify.max_queued_events=16384
RUN sysctl fs.inotify.max_user_instances=8192
RUN sysctl fs.inotify.max_user_watches=524288