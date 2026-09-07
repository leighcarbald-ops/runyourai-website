# RunYourAI Website

Official public marketing website for RunYourAI.

## V1 scope

- Main landing page for RunYourAI
- AI Support Bot product section and Founding Client offer
- Review Funnel QR product section linking to the existing live `/create` flow
- Separate hidden `/ai-support-demo/` page
- Responsive mobile/desktop layout
- GitHub Pages deployment workflow

## Safety boundaries

- This repository does not contain product source code for the AI Support Bot or Review Funnel QR.
- The existing product repositories are treated as read-only dependencies/references.
- No DNS, Cloudflare, email records, credentials, API keys, secrets, or private customer information belong in this repository.
- The live `runyourai.pro` DNS must not be changed until the GitHub Pages preview is reviewed and explicitly approved.

## Current pre-launch blockers

1. Upload the supplied RunYourAI transparent logo asset at `assets/runyourai-logo.png` so the exact approved artwork is used. The page has a temporary styled-text fallback if the binary asset is absent.
2. Create or identify a dedicated public AI Support Bot demo widget key for the fictional demo business, then place that public key in `ai-support-demo/index.html` under `data-widget-key`. The worker origin is already set from the verified production deployment.
3. Replace/review the temporary privacy placeholder before the custom-domain launch.
4. Complete final mobile/desktop CTA testing after the live demo key and logo are in place.

## GitHub Pages preview

Expected project URL after the Pages workflow succeeds:

`https://leighcarbald-ops.github.io/runyourai-website/`
