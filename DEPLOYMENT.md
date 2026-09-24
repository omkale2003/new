# Clients deployment environments

`main` is the source of truth and runs CI without deploying. Merge `main` into
`develop`, `stage`, or `prod` to deploy the same code to that environment. Pull
requests run tests/build only; manual workflow runs respect the selected branch.

| Branch / GitHub environment | Site | API | Server directory | Serving |
| --- | --- | --- | --- | --- |
| develop | https://devclients.konkantrip.com | https://devapi.konkantrip.com/api/v1 | /var/www/konkantrip/dev/clients | Nginx static |
| stage | https://stageclients.konkantrip.com | https://stageapi.konkantrip.com/api/v1 | /var/www/konkantrip/stage/clients | Nginx static |
| prod | Unconfigured | https://api.konkantrip.com/api/v1 | /var/www/konkantrip/prod/clients | Unconfigured |

The workflow uses the existing repository secrets `SERVER_HOST`, `SERVER_USER`,
`SERVER_SSH_KEY`, and optional `SERVER_PORT` (defaults to 22). Each GitHub
environment permits its matching branch and supplies `DEPLOY_ENABLED` and `SITE_URL`.
The workflow fixes `VITE_API_BASE_URL` to the API listed above for each deployment
branch, so an environment variable cannot accidentally route to another environment.
The API URL is public build-time configuration, including
for images and admin requests. The optional `VITE_ENABLE_WHATSAPP_SIMULATOR`
variable defaults to `false` in deployments.

Production stays disabled (`DEPLOY_ENABLED=false`) until its site domain and
Nginx static root are configured. Dev/stage Nginx roots already point to
`/var/www/konkantrip/<environment>/clients/dist`, with SPA fallback to
`/index.html`. The deployment account needs write access to these directories.
No PM2 process, application port, or Nginx reload is needed for this app.

The LoginPage/RegisterPage test suites are advisory because their existing mocks
lack OTP exports (nine baseline failures). All other tests and the build are
required. Restore these two suites as required checks when their mocks are fixed.

After required tests/build pass, enabled deployments build with the environment's API URL,
copy `dist` over SSH to `clients/dist`, and verify the public HTTPS homepage,
login deep link, and deployed commit using `/version.txt`. Deployments are
serialized per branch. The separate `frontend` folders and ports 3000/3100 are
not deployment targets for this app.
Old hashed assets are retained for browsers still running the previous version.
To roll back, revert the change on `main` and promote it to the affected branch.
