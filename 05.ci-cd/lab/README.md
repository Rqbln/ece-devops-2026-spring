# CI/CD for User API (Lab 5)

This lab builds on the **User API** application from Part 4 and adds **Continuous Integration** and **Continuous Delivery**.

## Project structure

- Application code (from Lab 4): `04.continuous-testing/lab/`
- CI/CD configuration:
  - GitHub Actions workflows: `.github/workflows/`
    - `ci-node.yml` – runs tests on every push/PR.
    - `deploy-heroku.yml` – runs tests then deploys to Vercel using the Vercel CLI.
  - Vercel project: `devops-cicd-userapi` (root directory set to `04.continuous-testing/lab`).

## Continuous Integration (GitHub Actions)

Workflow: `.github/workflows/ci-node.yml`

- Triggers:
  - On push to `main`
  - On pull requests targeting `main`
- Steps:
  - Checkout repository
  - Setup Node.js 18
  - `npm ci || npm install` in `04.continuous-testing/lab`
  - Start a Redis service container and run `npm test`

The CI job ensures that all unit and API tests from Lab 4 pass before any change is merged.

## Continuous Delivery (GitHub Actions + Vercel)

Workflow: `.github/workflows/deploy-heroku.yml`

- Trigger:
  - On push to `main`
- Steps:
  - Checkout repository
  - Setup Node.js 18
  - `npm ci || npm install` in `04.continuous-testing/lab`
  - Start a Redis service container and run `npm test`
  - Install Vercel CLI (`npm install -g vercel@latest`)
  - `vercel pull --yes --environment=production`
  - `vercel build --prod`
  - `vercel deploy --prebuilt --prod`

Required GitHub Actions secret:

- `VERCEL_TOKEN` – Vercel access token with rights to deploy the `devops-cicd-userapi` project.

## How to observe the pipeline

1. Push a commit to the `main` branch of this repository.
2. On GitHub, open the **Actions** tab:
   - Workflow **CI - Node.js User API** should run and pass.
   - Workflow **CD - Deploy to Vercel** should run, re-run tests, then build and deploy.
3. On Vercel, open the **devops-cicd-userapi** project and check the latest deployments.

