# Website Production QC Standard

This checklist is a mandatory final gate for every RunYourAI website build and for material redesigns.

## 1. Cross-page design-system consistency
Open every public page side by side. Verify that equivalent information follows the same visual hierarchy.
- Header, logo, navigation order, active state, and primary CTA
- Hero spacing, heading treatment, typography, buttons, and responsive behavior
- Pricing placement, offer badges, regular vs promotional price treatment, payment terminology, and CTA
- Card radius, borders, spacing, section rhythm, and background treatments
- Footer structure, links, contact information, and legal links
- Mobile layouts at narrow phone widths and desktop layouts
- No page should look as though it belongs to a different website unless intentionally documented

## 2. Pricing and offer consistency
Compare every displayed price against the approved current offer before release.
- Homepage/service directory price matches the service page
- Promotional eligibility/count is consistent
- Setup, deposit/final payment, recurring hosting/maintenance, and one-time charges use consistent terminology
- No obsolete price remains in metadata, hero cards, lower-page sections, CTA copy, or duplicated pricing blocks
- Do not expose internal pricing rules unless they are intended as customer-facing terms

## 3. Navigation and conversion paths
- Every header/footer link resolves to the intended page
- No duplicate or obsolete navigation item
- Primary CTA on each page has a clear next action
- Forms, mail links, phone links, demos, checkout/onboarding links, and anchors work
- No dead-end sales page

## 4. Content and trust
- Business name, service names, contact details, scope, and claims are consistent
- No placeholder copy, contradictory statements, accidental internal notes, or duplicated sections
- Headings are logical and readable
- Legal/privacy/terms links are present where required

## 5. Responsive and accessibility
- Check phone, tablet, and desktop widths
- No horizontal overflow, clipped text, overlapping cards, or unusable sticky elements
- Buttons and form controls remain tappable
- Images have useful alt text; forms have labels; focus states and skip navigation remain usable
- Reduced-motion behavior is respected where animation exists

## 6. Technical/SEO
- Unique title and meta description
- Correct canonical URL and index directives
- Social metadata where applicable
- HTTPS assets only; no broken resources
- No obvious console/runtime errors
- Sitemap/robots and structured data remain accurate when applicable

## 7. Final whole-site comparison gate
This is separate from page-by-page QC and cannot be skipped.
1. Open the homepage plus every primary service page.
2. Compare them as one customer journey, not as isolated pages.
3. Compare pricing and CTAs side by side.
4. Compare desktop and mobile presentation.
5. Fix unexplained visual or terminology drift before marking production-ready.

A site does not pass final QC merely because each page works independently. It passes only when the complete site is functionally correct and visually coherent as one design system.
