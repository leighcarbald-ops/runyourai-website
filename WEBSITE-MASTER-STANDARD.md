# RunYourAI — Master Website Building & Visual QC Standard
**Status: MANDATORY for all website work, including one-page mockups, speculative prospect demos, multi-page demos, rebuilds, edits, and paid production sites.**

**Read this document before planning, coding, reviewing, previewing, or declaring website work complete.** Every relevant AI agent must acknowledge this standard in its work report. This is the canonical policy. `docs/WEBSITE-NORTH-STAR-QC.md` and `WEBSITE-QC-STANDARD.md` provide additional detail and remain required. Apply the stricter compatible requirement if wording differs.

## 1. Non-negotiable principle
Every prospect demo is a sales presentation and portfolio piece. Its design, responsiveness, usability and conversion journey must meet the same standard as a commissioned site. The goal is business-specific, premium, believable, polished work—not merely a site that runs. No fabricated real-world facts or deceptive functional claims.

## 2. Discovery and business fit
- Identify audience, category, service boundaries, geography, value proposition, brand, primary visitor action and key objections before design.
- Validate business name, services, service limitations, service areas, operating hours, phone, address, price, guarantees, qualifications and links from reliable information provided or publicly verified.
- Never invent staff, credentials, business history, reviews, ratings, awards, certifications, pricing, guarantees, projects, before-and-after examples or measurable outcomes.
- Do not display residential addresses for home-based businesses without explicit owner authorization.
- Differentiate fictional demonstration copy from verified client details. Never make a nonfunctional demo form look as if it submitted.
- Tailor imagery to *how* the business actually operates (e.g. mobile mechanic at driveway or roadside—not a full automotive shop).

## 3. Premium design system
- Choose an appropriate premium visual direction per business, not an identical template on every job. Light and dark themes are both valid.
- Specify palette, accent, typography, spacing scale, borders, corner radii, cards, buttons, interactive states, section rhythm, photography style and grid before implementation.
- Past preferred references: dark #0A0A0C/#0F172A or light #FAFAFA with an intentional vivid accent, subtle borders and selectively used frosted cards; Inter, Plus Jakarta Sans and Syne are useful options, **not compulsory brand restrictions**.
- Maintain excellent hierarchy, thoughtful negative space, balanced imagery and clear text contrast.
- Avoid random full-width background changes, overcrowding, tiny navigation, excessive gradients/glows, clashing component treatments, decorative animation without purpose or arbitrary fixed headers.
- Use animation/microinteractions only when accessible, performant, purposeful and motion-preference respectful.
- Match the *quality level* of premium RunYourAI examples without copying unrelated category aesthetics.

## 4. Images and other assets
- Use high-quality, commercially permissible, business-appropriate photography with intentional crops and descriptive alt text.
- No broken/missing photos, irrelevant stock-style imagery, distorted aspect ratios or unnecessary duplicate images in different service sections.
- For image-rich categories, assemble a varied category-relevant candidate set (historical working preference: approximately six distinct options per category) and select individually appropriate images rather than indiscriminate repetition. This is a creative sourcing target, not a mandate for six images per page.
- Optimize dimensions and file sizes, maintain crisp mobile appearance, avoid layout shift. Image zoom/lightbox only if it improves the use case and operates correctly.

## 5. Pages, information architecture and conversion
- Standard offering: Home, About, Services and Contact/Book/Quote, adapted if a different structure better supports the business.
- Each site has one prioritized conversion (estimate, booking, order, consultation, contact). Place primary CTA early and repeat at useful decision points; provide a secondary low-friction path.
- The homepage answers: what, for whom, where, why trust, and what next. Service content is specific and scannable; About reflects real people/story only when verified; Contact shows correct methods, hours, service area and friction-light inquiry.
- Headings and copy use credible, natural language; no placeholder text, fake urgency, filler, stale promotional terms, spelling errors, or unsupported claims.
- Every prominent CTA has an appropriate destination. No dead-end service pages.
- Forms request only necessary information, label required fields, validate appropriately, show clear success/error states, and respect privacy. Demos that cannot transmit must be explicitly labeled non-submitting.

## 6. Mobile-first and responsive QA
- Design and visually test actual rendered pages on phone, tablet and desktop widths; at minimum test narrow mobile (~360px), medium (~768px) and desktop (~1440px), with additional breakpoints as issues warrant.
- Verify header logo, navigation, mobile menu, legible type, tappable CTAs, form controls, image composition, cards, spacing, sticky/fixed behavior, footer and key conversion path.
- No clipped text, overflow, overlapping content, tiny tabs, obstructive sticky navigation or sections that unexpectedly break visual rhythm.
- Use keyboard as well as touch/pointer to test primary interactions.

## 7. Functionality, accessibility, performance, SEO and security
- Visit and click-test every public nav link, logo, footer link, relevant anchor, CTA, call/email/social/map link, order/quote/booking flow and active form.
- Images load; no browser console/runtime errors, mixed-content requests or failed critical assets.
- Semantic headings, text alternatives, accessible form labels, visible focus states, meaningful keyboard order, readable contrast, and reduced-motion support.
- Optimize web fonts, images, JS and CSS; avoid heavy unnecessary frameworks and motion; assess layout stability.
- Unique descriptive page titles, meta descriptions, appropriate heading structure, semantic HTML, natural service/location copy; correct social metadata, canonical, indexing, robots/sitemap and structured data as relevant.
- No secrets, credentials, user personal information or internal notes in client deliverables. Respect privacy and security in integrations.
- Production checkout, forms and business systems must actually work; a visual simulation is not a live feature.

## 8. Pricing, trust, and cross-page consistency
- Match published prices, promotion eligibility, deposit/final payment terminology, recurring maintenance and setup terms to currently approved offers; eliminate stale copies in page text and metadata.
- Ensure header, nav order/states, brand identity, type scale, buttons, form language, section spacing, card styling, pricing, CTA language and footer are coherent across *all* pages.
- Check whole-site customer journey, not just isolated components or edited files. No section or page should look conspicuously lower quality without an intentional documented reason.

## 9. Required **visual inspection** — NO CODE-ONLY PASS
**A code review, passing build, deploy notification or automated tests are not enough to claim visual QC.**
1. Render the actual site in a browser, including every primary page and materially changed section.
2. Inspect at minimum **360px, 768px and 1440px** viewports (or realistic device equivalents).
3. Review screenshots/actual rendering for typography, layout, imagery, crops, color consistency, overlays, scroll behavior, and the header/footer. Inspect complete page length, not only above the fold.
4. Manually exercise navigation, menu, CTA, image/lightbox and form behavior, including on mobile.
5. Correct issues and re-render/re-test affected pages and breakpoints.
6. Provide links to preview and/or labeled screenshots or other traceable evidence in the final review; state precisely what was seen and tested.
7. If browser rendering/screenshots are unavailable, mark **VISUAL QC: NOT VERIFIED** and **NOT READY FOR APPROVAL**. Never imply it passed.

## 10. Required final QC report and release decision
Evaluate **each**: Business Fit, Conversion, Technical, Visual Polish, Whole-site Consistency, and Visual Inspection. Mark **PASS / FAIL / NOT VERIFIED** and list evidence (pages, viewports, clicks, screenshots, outstanding defects). Do not declare production-ready while any criterion is FAIL or NOT VERIFIED. An early demo may be shared as an *unapproved preview* when explicitly labeled as such.

**Stop-ship conditions:** wrong or fictionalized real business claims; missing/repeated/irrelevant important imagery; broken navigation, CTA, forms or significant links; inaccessible conversion journey; mobile clipping or overlaps; serious visual inconsistency; conspicuously templated or incomplete copy; improper pricing; missing required legal/privacy basics; uninspected visual output.

## 11. Agent onboarding and enforcement boundaries
- Instructions entrypoints: repository root `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and PR template must link here and to both supporting standards.
- Agents explicitly configured to read these files must read them **before performing website work** and state that they did so. A standalone AI merely visiting GitHub cannot technically be compelled to read Markdown; tools differ in instruction-discovery behavior.
- A PR template is a reviewer checklist, **not** a blocking rule by itself. To enforce merge blocking, use branch rulesets/protection with required CI status checks and/or approval requirements; visual correctness requires actual browser review or screenshot evidence plus human/agent judgment.
- Apply equivalent entrypoint instructions to *each client repository* separately; these instructions are not globally inherited across GitHub repositories.
