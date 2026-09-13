# ButterNet Website

This is the ButterNet website.

## Deployment

Upload this folder to a GitHub repository and connect that repository to Cloudflare Pages.

The site is static and can be deployed before the ButterNet API is finished.

The frontend is already prepared to communicate with:

- `/api/health`
- `/api/rooms`

Those endpoints can be added later using Cloudflare Pages Functions.

Do not place passwords, Photon App Secrets, database credentials, or other private secrets in this repository.
