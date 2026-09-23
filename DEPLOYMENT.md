# Frontend environments

`main` is the source of truth and runs CI without deploying. Merge `main` into
`develop`, `stage`, or `prod` to deploy the same code to that environment. Pull
requests run tests/build only; manual workflow runs respect the selected branch.

| Branch / GitHub environment | Site | API | Server directory | Port |
| --- | --- | --- | --- | --- |
| develop | https://dev.konkantrip.com | https://devapi.konkantrip.com/api/v1 | /var/www/konkantrip/dev/frontend | 3000 |
| stage | https://stage.konkantrip.com | https://stageapi.konkantrip.com/api/v1 | /var/www/konkantrip/stage/frontend | 3100 |
| prod | Unconfigured | Unconfigured | /var/www/konkantrip/prod/frontend | Unconfigured |

The workflow uses the existing repository secrets `SERVER_HOST`, `SERVER_USER`,
`SERVER_SSH_KEY`, and optional `SERVER_PORT` (defaults to 22). Each GitHub
environment permits its matching branch and supplies `DEPLOY_ENABLED`, `PORT`,
and `VITE_API_BASE_URL`. The API URL is public build-time configuration, including
for images and admin requests. The optional `VITE_ENABLE_WHATSAPP_SIMULATOR`
variable defaults to `false` in deployments.

Production stays disabled (`DEPLOY_ENABLED=false`) until its domain, API, unused
port, and reverse proxy are configured. Dev/stage use the existing Nginx routes
to ports 3000/3100. The deployment account needs Node.js, PM2, curl, and write
access to the environment directory. No Nginx changes are required.

The LoginPage/RegisterPage test suites are advisory because their existing mocks
lack OTP exports (nine baseline failures). All other tests and the build are
required. Restore these two suites as required checks when their mocks are fixed.

After required tests/build pass, enabled deployments build with the environment's API URL,
copy `dist` over SSH, and start/restart only `konkantrip-<environment>-frontend`
using PM2's static SPA server. Deep links fall back to `index.html`. Deployments
are serialized per branch and verify the served commit using `/version.txt`.
Old hashed assets are retained for browsers still running the previous version.
To roll back, revert the change on `main` and promote it to the affected branch.
