![Build](https://github.com/InseeFr/Pearl-Jam/actions/workflows/release.yml/badge.svg)

# Pearl Jam

Case management web application for Computer-Assisted Personal Interviewing (CAPI)

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

- Once you are inside the container, you need maybe to run an install, because some dependencies are post-processed and depends on the OS.

```shell
# You are in the reactapp container
yarn
```

- You can now run the **Vite** server and/or run the Playwright tests suite.
  When you launch Playwright, the **Vite** server will be started (you do not need to start it manually).

```shell
# You are in the reactapp container
yarn dev
npx playwright test --ui-port=8888 --ui-host=0.0.0.0 --workers=1
```

The application will be available on http://localhost:5173 and the Playwright UI on http://localhost:8888.
