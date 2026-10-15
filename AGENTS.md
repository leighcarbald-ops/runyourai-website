# RunYourAI Website Build Instructions — All Agents

These requirements apply to **every website in this repository**, including a prospect mockup, speculative demo, prototype, redesign, and paid production website. **A demo is a sales asset, not a lower-quality website.**

## Mandatory source of truth (read before editing)
1. [docs/WEBSITE-NORTH-STAR-QC.md](docs/WEBSITE-NORTH-STAR-QC.md) — business fit, conversion architecture, technical QC, visual polish, demo quality, stop-ship failures.
2. [WEBSITE-QC-STANDARD.md](WEBSITE-QC-STANDARD.md) — whole-site consistency, responsive checks, content, navigation, prices, and final QC.

If rules conflict, follow the more stringent quality/safety requirement; do not override verified business facts or the customer's instructions. If either document is inaccessible, report this as a blocker instead of claiming QC passed.

## Workflow required for ALL agents (Hermes, Harvey, Claude Code/CCR, Codex, ChatGPT and collaborators)
1. **Read both standards before planning or coding.** Identify the business, audience, core action (quote/book/order/contact), verified facts, and unknowns.
2. **Build business-specific work, not a generic template.** Use relevant, legal-to-use, working images; intentional responsive visual design; coherent cross-page typography, sections, colors, navigation, buttons, and calls to action.
3. **Do not fabricate** reviews, staff, awards, certifications, prices, hours, addresses, service areas, or performance claims. Do not expose personal residential addresses without consent. Mark hypothetical/demo-only facts clearly when appropriate.
4. **Treat demos as premium builds** with the same visual and conversion standard as a paying customer's site. If a demo form does not submit, label it clearly as a demo rather than pretending it works.
5. **Test the entire deliverable**, not just the edited page: mobile, tablet, desktop; all imagery, interactive controls and links; content correctness; accessibility basics; layout consistency; no console errors or missing assets.
6. **Fix stop-ship failures before saying “complete”** as enumerated in the North Star file. If a check cannot be performed, say **NOT VERIFIED**, give the reason, and do not claim full QC approval.
7. **Report completion with evidence:** pages changed, verification/test results, demo-only limitations, remaining issues, and whether each of the four North Star gates **PASS / FAIL / NOT VERIFIED**. Never report success simply because code committed or deployed.

## Acceptance criteria
- Gate 1: Business Fit — business/category accurate, relevant assets, believable and verified claims.
- Gate 2: Conversion — obvious primary CTA and friction-light visitor path on every relevant page.
- Gate 3: Technical — working assets/navigation/forms (or explicitly demo-labeled forms), accessible, responsive, performant.
- Gate 4: Visual Polish — premium and intentional on every page/screen size; no inconsistent sections or repeated/missing images.
- Final whole-site QC — consistent header/footer, hierarchy, pricing, interaction and visual system across pages.

**Stop ship:** broken or missing images; irrelevant, repetitive imagery; dead CTA; broken/mobile-hostile layouts; fabricated facts; generic or noticeably unfinished design; unresolved major cross-page drift. Never hide a failure or reduce standards because it is “only a mockup.”

These instructions are repository-local. Separate client repositories must receive their own copy or be explicitly configured to load these standards; merely referencing this file elsewhere does not automatically enforce it.
