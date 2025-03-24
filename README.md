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
