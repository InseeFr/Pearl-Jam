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

## Run the project in a Docker environnement

We have a dedicateed `compose.yml` file we can use in order to launch the _front_end_ inside Docker.

- You need first to build all images

```shell
docker compose up
```

- Once this step is done, you can go inside the `front` service and execute whatever you want.

```shell
docker exec -it reactapp /bin/sh
```

- You can now run the **Vite** server and/or run the Playwright tests suite.
  When you launch Playwright, the **Vite** server will be started (you do not need to start it manually).

// TODO: Pick if we either want the user to launch a dev server or let directly the service launching it

```shell
# You are in the reactapp container
yarn dev --host
npx playwright test --ui-port=8888 --ui-host=0.0.0.0 --workers=1

# Generating a test file by captation
npx playwright codegen test http://localhost:5173
```

The test running application (`playwright test`) will be available on http://localhost:5173 and the Playwright UI on http://localhost:8888.

Containers should not be killed to ensure data persistence in order to avoid a full yarn install. Instead, you should either use `CTRL+C` in the bash/shell where it was launched or run `docker compose stop`.

```

```
