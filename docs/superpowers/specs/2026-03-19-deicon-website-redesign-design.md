# deicon.de Website Redesign — Design Spec

## Overview

Complete redesign of www.deicon.de from a dated Jekyll/Bootstrap site to a modern single-page landing page. The company has evolved from Java/XML consulting to IT Strategy, IT Due Diligence, Cloud Native Architectures, and AI Transformation. The new site targets technical leaders (CTOs, VPs of Engineering) evaluating consulting partners.

## Format

Single-page landing page, bilingual (German primary, English via toggle). No subpages except legally required Impressum and Datenschutz.

## Tech Stack

- **Astro** — static site generator, zero JS by default, built-in i18n routing, content collections for blog
- **Tailwind CSS** — utility-first styling, dark theme support
- **GitHub Pages** — deployment target (existing CNAME: www.deicon.de)
- **Blog content** — Markdown files in `content/blog/`, separate files per language
- **i18n routing** — `/` for German (default), `/en/` for English

No database, no server, no client-side JS framework. One small inline `<script>` for scroll-reveal animations (IntersectionObserver), included as an Astro inline script.

## Migration & Deployment

- **Same repo**: Replace Jekyll files with Astro project on a feature branch. Merge to `master` when ready.
- **GitHub Actions**: Add a workflow to build Astro and deploy to GitHub Pages (replaces Jekyll's auto-detection).
- **GitHub Actions workflow**: `.github/workflows/deploy.yml` — builds with `astro build`, deploys via `actions/deploy-pages`.
- **Preserve in `public/`**: `CNAME` (www.deicon.de) and `.well-known/` directory (webfinger).
- **Old URLs**: Existing pages (`/Leistungen/`, `/Projekte/`, `/Kontakt/`, `/Publikationen/`, `/Blog/`) will 404 after migration. No redirects planned — existing external links are negligible.
- **Legacy cleanup**: Remove all Jekyll files on the feature branch (`_config.yml`, `_data/`, `_includes/`, `_layouts/`, `_Infos/`, `pages/`, `down/`, `feed.xml`, `index.jade`, `index.html`, `Gemfile`, `Gemfile.lock`, `404.html`).
- **Rollback**: Feature branch stays until verified. If issues arise post-merge, revert the merge commit.

## Visual Direction: Bold & Confident

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1a2744` | Backgrounds, hero, header |
| Darker | `#0f1a2e` | Alternating sections, footer |
| Darkest | `#0a1220` | Footer background |
| Accent | `#e8651a` | Highlights, dividers, keywords (from logo) |
| Accent CTA | `#e8651a` bg + `#1a2744` text | Buttons — dark text on orange for AA contrast |
| Text primary | `#ffffff` | Headings on dark |
| Text secondary | `#8899b0` | Body text on dark |
| Text muted | `#7788a0` | Footer text (meets WCAG AA 4.5:1 on darkest bg) |
| Surface | `rgba(255,255,255,0.03)` | Card backgrounds |
| Border | `rgba(255,255,255,0.08)` | Card/section borders |
| Accent border | `rgba(232,101,26,0.15)` | Keyword tag borders |

### Typography

- **Font family:** Inter (self-hosted via `@font-face` — no Google Fonts CDN, for DSGVO compliance)
- **Headings:** 800 weight, letter-spacing -1px to -0.5px
- **Body:** 400 weight, 15px, line-height 1.7
- **Section labels:** 12px, uppercase, letter-spacing 3px, accent color
- **Keywords:** 11px, 600 weight, letter-spacing 0.5px

### Design Elements

- Orange accent bars (3px) below key headings
- Gradient line dividers between sections: `linear-gradient(90deg, transparent, rgba(232,101,26,0.3), transparent)`
- Cards with semi-transparent backgrounds and borders, hover effects (border glow, translateY -2px)
- Generous whitespace throughout
- Stock photography on Kompetenzen items (self-hosted, not loaded from external CDN — darkened with overlay, zoom on hover). Use Astro's `<Image>` component for WebP/AVIF generation and responsive `srcset`.
- Deicon logo arc: to be integrated later as SVG, used as decorative motif in hero, dividers, and card watermarks

### Responsive Behavior

Mobile-first with these breakpoints:

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Single column everywhere. Nav collapses to hamburger menu. Hero headline scales down to 28px. |
| Tablet | 640px–1024px | Kompetenz items stack to single column (image above text). Blog grid: 2 columns. Contact grid stacks. |
| Desktop | > 1024px | Full layout as mockup. Kompetenz 2-column with alternating sides. Blog 3 columns. Contact 2 columns. |

## Page Sections

### 1. Navigation (sticky)

- Logo text "deicon." (arc to be added later)
- Anchor links: Kompetenzen, Insights, Kontakt
- Language toggle: DE / EN (navigates to `/` or `/en/` — full page reload, no client-side switching)
- Mobile: hamburger menu icon, opens overlay with nav links
- Background: `#1a2744`, sticky top, z-index 100

### 2. Hero

- Headline: "Wir machen Technologie zur Strategie." (EN: TBD)
- Orange accent bar (48px wide, 3px tall)
- Service keywords: IT Strategy · IT Due Diligence · Cloud Native · AI Transformation
- Uppercase, letter-spaced, muted color, orange dot separators
- Centered layout, generous vertical padding (100px top, 88px bottom)

### 3. Kompetenzen

- Section label: "KOMPETENZEN"
- 4 items, stacked vertically, scroll-revealed (fade in + translateY)
- Each item: 2-column grid (text + stock photo), alternating sides
- Text side: large faded number (01–04), heading, description paragraph, orange accent bar, keyword tags
- Image side: Unsplash stock photo, darkened (brightness 0.55, saturation 0.8), overlay gradient, zoom on hover
- Content per item:

**01 IT Strategy**
- Keywords: Roadmapping, Tech Radar, Architecture Review, Make or Buy
- Image: office/strategy scene

**02 IT Due Diligence**
- Keywords: Code Quality, Tech Debt, Team Evaluation, Risk Analysis
- Image: business analysis scene

**03 Cloud Native Architectures**
- Keywords: Kubernetes, Microservices, CI/CD, IaC
- Image: data center/globe

**04 AI Transformation**
- Keywords: LLM Integration, AI Readiness, Process Automation, RAG
- Image: AI visualization

### 4. Insights / Blog

- Section label: "INSIGHTS"
- Shows latest 3 blog posts in a responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- Each card: date, title, excerpt — clickable, links to a full blog post page (e.g., `/blog/post-slug/`)
- Hover: border glow, slight lift
- Content driven by Astro content collections (Markdown)
- Blog post frontmatter: `title`, `date`, `excerpt`, `lang` (de/en), `tags` (optional)
- Directory structure: `content/blog/de/` and `content/blog/en/`
- Only posts matching the current language are shown
- If fewer than 3 posts exist, grid adjusts (no empty cards)
- Blog post pages use the same dark layout with back-to-home navigation

### 5. Kontakt

- Section label: "KONTAKT"
- 2-column layout: form (1.2fr) + company info (0.8fr)
- Form fields: Name, E-Mail, Nachricht (textarea), DSGVO consent checkbox (links to Datenschutz), submit button
- Dark input styling with orange focus border
- Success/error states: inline message below form after submission
- Company info: address, phone, email
- Form submission: Formspree via AJAX (`fetch()` POST in a small inline script). On success, show inline "Vielen Dank" message and hide form. On error, show inline error. No page redirect — user stays in place.

### 6. Footer

- Background: `#0a1220`
- Left: © 2026 deicon it solutions GmbH & Co. KG
- Right: Impressum · Datenschutz (links to separate pages)

## Separate Pages

- **Impressum** — required by German law (TMG §5), static content page. German only (legally sufficient).
- **Datenschutz** — privacy policy, required by DSGVO, static content page. German only.
- **Blog post pages** — individual pages at `/blog/<slug>/` (DE) and `/en/blog/<slug>/` (EN). Same dark layout, content from Markdown.
- **404 page** — styled to match site design, with link back to homepage.

## DSGVO Compliance

- **Fonts**: Inter self-hosted via `@font-face` — no external CDN requests.
- **Images**: All stock photos self-hosted in `src/assets/` — no external image loading.
- **Contact form**: DSGVO consent checkbox required before submission, linking to Datenschutz page.
- **Analytics**: Not included in initial launch. If added later, a cookie consent banner is mandatory.
- **No cookies**: The initial site sets no cookies (Formspree does not require them).

## Accessibility

- Follow WCAG 2.1 AA baseline.
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>` landmarks. Proper heading hierarchy (h1 in hero, h2 for section titles, h3 for card headings).
- Color contrast: verify all text/background combinations meet 4.5:1 ratio. Adjust `#8899b0` and footer text color if needed.
- Focus states: visible focus ring on all interactive elements (links, buttons, form inputs). Style to match accent color.
- Skip-to-content link at top of page.
- Alt text: descriptive alt text for all Kompetenz images.
- `prefers-reduced-motion`: disable scroll-reveal animations when user prefers reduced motion.

## SEO

- Page `<title>` and `<meta description>` per language.
- Open Graph and Twitter Card meta tags for social sharing.
- Structured data: Organization schema (JSON-LD).
- Canonical URLs for bilingual pages.
- `hreflang` link tags on every page (`<link rel="alternate" hreflang="de" ...>` and `<link rel="alternate" hreflang="en" ...>`).
- Sitemap generation via `@astrojs/sitemap`.

## i18n Architecture

- Astro's built-in i18n with static routing: two separate page trees.
- German (default): `/`, `/blog/<slug>/`, `/impressum/`, `/datenschutz/`
- English: `/en/`, `/en/blog/<slug>/`
- Shared Astro layouts and components; content passed as props per language.
- Language toggle in nav: on landing page, links to `/` or `/en/`. On blog post pages, links to the translated post if it exists, otherwise to the language root.
- Blog content: `content/blog/de/*.md` and `content/blog/en/*.md`. Posts use matching slugs across languages when translations exist.
- Impressum and Datenschutz: German only (no English versions needed).

## Open Items

**Blocks launch:**
- [ ] Final stock photos — download from Unsplash and self-host
- [ ] English translations for all content (including hero headline)
- [ ] Formspree account setup and endpoint configuration
- [ ] Final service descriptions (placeholder German copy exists in mockup)

**Post-launch:**
- [ ] Deicon arc/swoosh SVG — to be created separately and integrated as decorative motif
- [ ] Blog post content (placeholder titles exist in mockup — site can launch with 0 posts, section hidden)
- [ ] Analytics setup (if desired — requires cookie consent implementation)

## Reference Mockup

Visual prototype available in `.superpowers/brainstorm/86295-1773941157/design-system-v6.html`
