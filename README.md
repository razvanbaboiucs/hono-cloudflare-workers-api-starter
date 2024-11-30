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