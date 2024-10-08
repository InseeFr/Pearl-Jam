![Build](https://github.com/InseeFr/Pearl-Jam/actions/workflows/release.yml/badge.svg)

# Pearl Jam

Case management web application for Computer-Assisted Personal Interviewing (CAPI)

## Running Unit Tests

Unit Tests use the **Vitest** framework. You can run these tests with the following command:

```shell
yarn test
yarn test --coverage
```

## Running Playwright Tests

We can also run end-to-end test thank to **Playwright**.

```
yarn playwright
yarn playwright --ui
```

Before executing the test, we will :

- build the project (in order to be sure that the test are running on the production-ready application)
- launch a static server (thanks to **npx serve**)
- launch a proxy (with **Caddy**), in order to be able to setup HTTPS connexion (usefull for PWA)
