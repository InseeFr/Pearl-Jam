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

```
podman compose --env-file .env.docker --profile stack down -v
```

Beware of old local front images, clear them before testing.

## Playwright

Install chromium

```
npx playwright install chromium
```

Launch services related to playwright testing with podman.
It will build a front image of this app as we specically need to test on builded version since service workers do no work the same way in a local dev server.

You might need to set proxies in Dockerfile, do not push them !

```
podman compose --env-file .env.docker --profile playwright up -d
```

Run tests

```
npx playwright test --ui-port=8888 --ui-host=localhost
```
