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

No database, no server, no client-side JS framework.

## Visual Direction: Bold & Confident

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1a2744` | Backgrounds, hero, header |
| Darker | `#0f1a2e` | Alternating sections, footer |
| Darkest | `#0a1220` | Footer background |
| Accent | `#e8651a` | CTAs, highlights, dividers, keywords (from logo) |
| Text primary | `#ffffff` | Headings on dark |
| Text secondary | `#8899b0` | Body text on dark |
| Text muted | `#556` | Footer text |
| Surface | `rgba(255,255,255,0.03)` | Card backgrounds |
| Border | `rgba(255,255,255,0.08)` | Card/section borders |
| Accent border | `rgba(232,101,26,0.15)` | Keyword tag borders |

### Typography

- **Font family:** Inter (Google Fonts)
- **Headings:** 800 weight, letter-spacing -1px to -0.5px
- **Body:** 400 weight, 15px, line-height 1.7
- **Section labels:** 12px, uppercase, letter-spacing 3px, accent color
- **Keywords:** 11px, 600 weight, letter-spacing 0.5px

### Design Elements

- Orange accent bars (3px) below key headings
- Gradient line dividers between sections: `linear-gradient(90deg, transparent, rgba(232,101,26,0.3), transparent)`
- Cards with semi-transparent backgrounds and borders, hover effects (border glow, translateY -2px)
- Generous whitespace throughout
- Stock photography on Kompetenzen items (darkened with overlay, zoom on hover)
- Deicon logo arc: to be integrated later as SVG, used as decorative motif in hero, dividers, and card watermarks

### Responsive Behavior

Mobile-first. Kompetenz items stack to single column. Blog cards stack. Contact form goes full-width above company info.

## Page Sections

### 1. Navigation (sticky)

- Logo text "deicon." (arc to be added later)
- Anchor links: Kompetenzen, Insights, Kontakt
- Language toggle: DE / EN
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
- 3-column grid showing latest blog posts
- Each card: date, title, excerpt
- Hover: border glow, slight lift
- Content driven by Astro content collections (Markdown)

### 5. Kontakt

- Section label: "KONTAKT"
- 2-column layout: form (1.2fr) + company info (0.8fr)
- Form fields: Name, E-Mail, Nachricht (textarea), submit button
- Dark input styling with orange focus border
- Company info: address, phone, email
- Form submission: TBD (Formspree or similar)

### 6. Footer

- Background: `#0a1220`
- Left: © 2026 deicon it solutions GmbH & Co. KG
- Right: Impressum · Datenschutz (links to separate pages)

## Separate Pages

- **Impressum** — required by German law (TMG §5), static content page
- **Datenschutz** — privacy policy, required by DSGVO, static content page

## Open Items

- [ ] Deicon arc/swoosh SVG — to be created separately and integrated as decorative motif
- [ ] Final stock photos — Unsplash placeholders to be replaced or confirmed
- [ ] English translations for all content
- [ ] Blog post content (placeholder titles exist)
- [ ] Contact form backend (Formspree or alternative)
- [ ] Final service descriptions (placeholder German copy exists)
- [ ] Analytics setup (if desired)

## Reference Mockup

Visual prototype available in `.superpowers/brainstorm/86295-1773941157/design-system-v6.html`
