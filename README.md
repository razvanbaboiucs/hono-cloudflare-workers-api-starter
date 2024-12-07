# Cloudflare + Hono 🔥 starter template

The present serves as a simple starter template for building a backend API with [Hono](https://hono.dev/) that is deployed to [Cloudflare Workers](https://workers.cloudflare.com/) and using [Cloudflare D1](https://developers.cloudflare.com/d1/) for the database. It also includes usage of [Workers AI](https://developers.cloudflare.com/workers-ai/).

Template features:

- 🔥 Deployed to Cloudflare Workers
- 🔥 Database using Cloudflare D1
- 🔥 Cloudflare Workers AI
- 🔥 Typescript
- 🔥 GitHub Actions for deployment and database migrations
- 🔥 JWT based authentication
- 🔥 Role based authorization
- 🔥 Email sending using Brevo

## Getting started

### Local development

1. Create a Cloudflare account
2. Install the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
3. Login to your Cloudflare account with `wrangler login`
4. Clone the repository
5. Run `npm install` to install the dependencies
6. Add a new file `.dev.vars` in the root of the project with the following content:

```bash
# Copy this file to .vars and adapt the values to your needs

# The origins that are allowed to access the API
CORS_ALLOWED_ORIGINS=http://localhost:3000

# JWT secret used in the authentication process
JWT_SECRET=myverysecretstring

# Brevo API key used for sending emails
BREVO_API_KEY=myverysecretstring
```

7. Run `npm run types` to generate the `worker-configuration.d.ts` file and to have access to the bindings.
8. Run `npm run db:migrate:local` to create a local database and apply the existing migrations.
9. Run `npm run dev` to start the development server.
10. Using your favorit API client (if you use Thunder Client, import the api from the `thunder-collection_hono-api-starter.json` file), and send a register POST request to `http://localhost:8787/api/v1/auth/register` with the following body structure:

```json
{
  "email": "test@test.com",
  "password": "test"
}
```

11. Send a login POST request to `http://localhost:8787/api/v1/auth/login` with the following body structure:

```json
{
  "email": "test@test.com",
  "password": "test"
}
```

12. You should receive a token in the response header `Authorization: Bearer <token>`.
13. Copy the token and send a GET request to `http://localhost:8787/api/v1/users` with the following header:

```json
{
  "Authorization": "Bearer <token>"
}
```

14. You should receive the current user information in the response body.
15. You are all set locally! Please feel free to explore the code and the API.

### Deploying to Cloudflare

1. Create a new Github repository for the project and push the code to it.
2. Copy the Cloudflare account ID from the Cloudflare dashboard. Go to the repository settings and add a new secret with the name `CLOUDFLARE_ACCOUNT_ID` and the value of the copied account ID.
3. Create a new Cloudflare API Token with the following settings:
- Permissions:
    - Account <> Workers Builds Configuration <> Edit
    - Account <> Workers AI <> Edit
    - Account <> D1 <> Edit
    - Account <> Cloudflare Pages <> Edit
    - Account <> Workers R2 storage <> Edit
    - Account <> Workers Tail <> Edit
    - Account <> Workers KV Storage <> Edit
    - Account <> Workers Scripts <> Edit
    - Account <> Account Settings <> Read
    - Zone <> Workers Routes <> Edit
- Zone Resources:
    - Include <> All zones from account

4. Copy the API token and add it as a secret to the repository with the name `CLOUDFLARE_API_TOKEN`.
5. Create a new D1 database for the development environment and copy the database ID. Edit the `wrangler.toml` file and add the database ID in the `d1_databases` section. Repeat the process for the D1 production database, but replace the `env.prod.d1_databases` section with the production database ID.
6. Push the code to the master branch and wait for the Github Actions to deploy the project to Cloudflare. Create a new branch `develop` for the development environment from the master branch.
7. Add a new secret to the dev and prod deployed workers: `npx wrangler secret put JWT_SECRET`. Follow the steps and paste the JWT secret. To add the secret to the production environment run the command `npx wrangler secret put JWT_SECRET --env prod`.
8. Adapt any other configurations in the `wrangler.toml` file as needed (like the CORS allowed origins).
9. You are all set! 🔥 You can now use the API by sending requests to the Cloudflare Pages URL. You can find the URL in the Cloudflare dashboard under the Workers section.

## Project structure and configuration

The project is structured as follows:
- `/src`: Contains the source code of the API.
- `/drizzle`: Contains the database migrations.
- `/src/db`: Contains the database schema and migrations.
- `/src/types`: Contains the types used in the project.
- `/src/utils`: Contains utility functions used in the project.
- `/src/api`: Contains the API routes.
- `/src/middleware`: Contains the middlewares used in the project.
- `/src/index.ts`: The main entry point of the project.
- `/wrangler.toml`: The configuration file for the Cloudflare infrastructure bindings.
- `/package.json`: The package configuration file.
- `/tsconfig.json`: The TypeScript configuration file.
- `/.dev.vars`: The development environment variables file.
- `/.drizzle.config.ts`: The Drizzle configuration file.
- `/.hono-context-extensions.ts`: The Hono context extensions file. Adds other types to the request context so it can be easily accessed from the request handlers.
- `/.github/workflows/`: The Github Actions workflows folder with 2 workflows: `deploy-develop.yml` and `deploy-production.yml`.

The `wrangler.toml` file contains the configuration for the production and development environments as follows:

- the values that are prefixed with `env.prod` are the production environment values.
- the values with no prefix are the development environment values.

## Database

### Database changes

Adapt the schema in `src/db/schema.ts`.

Run `npm run db:generate` to generate the migration files. The generated files will be in `drizzle/migrations`.

Run `npm run db:migrate:local` to apply the migrations to your local database.

## Wrangler

Wrangler is the cli tool used to deploy workers to Cloudflare and to configure the Cloudflare infrastructure bindings for those workers.

See the [wrangler documentation](https://developers.cloudflare.com/workers/wrangler) for more information.

### Wrangler configuration

Adapt the `wrangler.toml` file to your needs. This configures the Cloudflare infrastructure bindings.

After adapting the configuration, run `npm run types` to generate the `worker-configuration.d.ts` file and to have access to the bindings.

### Prod and Dev environments

The `wrangler.toml` file contains the configuration for the production and development environments.

The configuration for the production environment is explicitly set via the `env.prod` prefix for the properties and bindings.

Make sure to adapt the binding values to your needs.

## Deployment

If you did database changes, make sure the migrations are generated before merging.

Deployment is automatic when merging to `develop` or `main` branches, using Github Actions. 
You can find the defined actions undert the `.github/workflows` folder.

If you want to deploy manually, you can run `npm run deploy` to deploy the production environment.