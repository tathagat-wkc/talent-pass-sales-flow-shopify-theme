# Talent Pass Sales Flow Guide

This project now starts the new Talent Pass flow on home (`templates/index.json`).

## File structure

- `sections/talent-pass-sales-flow.liquid`
  - Main HTML structure for the flow.
  - Shopify Theme Editor settings (headlines, prices, CTA link) are defined in schema.
- `assets/talent-pass-sales-flow.css`
  - All visual styling, scoped to `.tp-flow`.
- `assets/talent-pass-sales-flow.js`
  - Quiz logic, category resolution, story card behavior, and plan rendering.

## How to update content quickly

- **Hero and pricing text**
  - Go to Theme Editor -> Home page -> `Talent Pass Sales Flow` section.
  - Update:
    - Flow label
    - Hero eyebrow/title/subtitle
    - Season label
    - Plan price and starting price
    - CTA label

- **Checkout action**
  - Set `Checkout or payment link` in the section settings.
  - If empty, CTA buttons scroll to the plan section instead of redirecting.

## How quiz mapping works

- Quiz state and mapping are in `assets/talent-pass-sales-flow.js`.
- Core functions:
  - `resolveCat()` maps answers to one category key.
  - `CATS` object stores per-category copy (name, why text, themes, review).
  - `resolveQuiz()` saves answers in session storage and navigates to result stage.

If you want to change category copy or monthly themes, edit the `CATS` object.

## Flow navigation (multi-page mode)

- Quiz stage: default page URL (no `tp_stage` query).
- Result stage: same URL with `?tp_stage=result`.
- On quiz completion:
  - answers are saved to `sessionStorage` key `tp_flow_state_v1`
  - browser does a full page navigation to `?tp_stage=result`
- On result load:
  - state is restored from session storage
  - if no state exists, user is returned to quiz stage automatically

## How story cards work

- Story slider IDs are `story_a`, `story_a-track`, `story_a-prog`, `story_a-dots`.
- Story interactions:
  - `storyNav()` for next/previous taps.
  - `storyInit()` to set up total slides.
  - `storyPersonalise()` injects category-specific values.

## Safe extension pattern

When adding new sections (for example FAQs, testimonials, footer CTA):

1. Add markup in `sections/talent-pass-sales-flow.liquid`.
2. Add styles in `assets/talent-pass-sales-flow.css` under `.tp-flow`.
3. Add behavior in `assets/talent-pass-sales-flow.js`.
4. Keep IDs unique and update JS selectors if needed.

## Notes

- Home is now dedicated to this funnel flow.
- Previous `templates/page.talent-pass-sale-quiz.json` was removed as no longer required.
