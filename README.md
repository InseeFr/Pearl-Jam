![Build](https://github.com/InseeFr/Pearl-Jam/actions/workflows/release.yml/badge.svg)

# Pearl Jam

Case management web application for Computer-Assisted Personal Interviewing (CAPI)

## Setup the Project

In order to run the application properly, you need define in a `.env.local` file these variables.

```
VITE_QUEEN_URL=
VITE_PEARL_API_URL=
VITE_PEARL_AUTHENTICATION_MODE=
```

## Run the full services stack

podman commands can be replaced by docker ones

```
podman compose --env-file .\.env.docker up
```

## Run the project in a Docker environnement

```
podman compose --env-file .\.env.local up playwright-captation
```

Containers should not be killed to ensure data persistence in order to avoid a full yarn install. Instead, you should either use `CTRL+C` in the bash/shell where it was launched or run `docker compose stop`.

frontend:
container_name: frontend
build:
dockerfile: ./Dockerfile
ports: - 80:80
environment:
VITE_PEARL_API_URL: http://localhost:8080
VITE_PEARL_AUTHENTICATION_MODE: keycloak
VITE_KEYCLOAK_CLIENTID: myclient
VITE_KEYCLOAK_REALM: standard
VITE_KEYCLOAK_URL: http://localhost:7080

playwright:
depends_on: - backend
container_name: reactapp
build:
dockerfile: ./playwright-dev.Dockerfile
hostname: front
volumes: \*react-volumes
tty: true
stdin_open: true # without this node doesn't start
working_dir: /opt/app
ipc: host
ports: - 5173:5173 - 8888:8888
environment:
WATCHPACK_POLLING: true
FAST_REFRESH: true
DISPLAY: unix:0
XDG_RUNTIME_DIR: /mnt/wslg/runtime-dir
command: - /bin/bash - -c - |
echo "Podman !!!" && sleep 1
mkdir -p /mnt/c/Windows/System32/WindowsPowerShell/v1.0 && sleep 1
touch /mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe && sleep 1
chmod '755' /mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe
yarn install
yarn dev && sleep 1
sleep infinity
