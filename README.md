![Build](https://github.com/InseeFr/Pearl-Jam/actions/workflows/release.yml/badge.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_Pearl-Jam&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=InseeFr_Pearl-Jam)

| Main                                                                                                                                                                                                               | Develop                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [![Main Playwright Tests](https://github.com/InseeFr/Pearl-Jam/actions/workflows/playwright.yml/badge.svg?branch=main&event=issue_comment)](https://github.com/InseeFr/Pearl-Jam/actions/workflows/playwright.yml) | [![Develop Playwright Tests](https://github.com/InseeFr/Pearl-Jam/actions/workflows/playwright.yml/badge.svg?branch=develop&event=issue_comment)](https://github.com/InseeFr/Pearl-Jam/actions/workflows/playwright.yml) |

# Pearl Jam

Case management web application for Computer-Assisted Personal Interviewing (CAPI)

## Setup the Project

In order to run the application properly, you need define in a `.env.local` file these variables.

```
VITE_QUEEN_URL=
VITE_PEARL_API_URL=
VITE_PEARL_AUTHENTICATION_MODE=
VITE_KEYCLOAK_CLIENTID=
VITE_KEYCLOAK_REALM=
VITE_KEYCLOAK_URL=
VITE_KEYCLOAK_ROLES_ALLOW_LIST=
```

## Run the project in a Docker environnement

```
podman compose --env-file .env.docker --profile stack up -d
```

Make sure sure your .env.local match your .env.docker

Kill and unmount containers

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
