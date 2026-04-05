# Cloudflare Migration Todo

- [x] Write down the migration plan so progress is easy to track across commits
- [x] Remove TanStack Start and convert the app to a plain Vite + TanStack Router SPA
- [x] Add a standard client entrypoint and HTML shell
- [x] Update package scripts and dependencies for Cloudflare deploys
- [x] Add `wrangler.jsonc` for production and staging Workers deploys
- [x] Add GitHub Actions workflow for preview and production Worker deploys
- [x] Run typecheck and clean up any migration regressions
- [ ] Set GitHub Environment secrets for `production` and `staging` (`VITE_CONVEX_URL`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`)
