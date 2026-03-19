# deicon.de Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild www.deicon.de as a modern Astro + Tailwind single-page landing page with bilingual support, blog, and contact form.

**Architecture:** Astro static site with i18n routing (DE default at `/`, EN at `/en/`), Tailwind CSS for styling, content collections for blog posts, Formspree AJAX for contact form. Deployed to GitHub Pages via GitHub Actions.

**Tech Stack:** Astro (pin to `astro@^5.0.0` — code written for 5.x APIs), Tailwind CSS 4.x, TypeScript, GitHub Actions, Formspree

**Note:** If `npm create astro@latest` scaffolds Astro 6+, either downgrade or audit for breaking changes (Zod imports move to `astro/zod`, Node 22+ required). This plan assumes Astro 5.x.

**Spec:** `docs/superpowers/specs/2026-03-19-deicon-website-redesign-design.md`
**Mockup:** `.superpowers/brainstorm/86295-1773941157/design-system-v6.html`

---

## File Structure

```
.github/workflows/deploy.yml          # GitHub Pages deploy workflow
astro.config.mjs                       # Astro config with i18n, sitemap, tailwind
package.json                           # Dependencies
tsconfig.json                          # TypeScript config
public/
  CNAME                                # Preserved: www.deicon.de
  .well-known/                         # Preserved: webfinger
  # Note: Inter fonts are self-hosted via @fontsource-variable/inter (bundled from node_modules, no CDN)
src/
  content.config.ts                    # Blog collection schema
  content/blog/
    de/cloud-native-kein-selbstzweck.md  # Placeholder DE blog post
    en/cloud-native-not-an-end.md        # Placeholder EN blog post
  i18n/
    translations.ts                    # All UI strings DE/EN
    utils.ts                           # getLangFromUrl, useTranslations helpers
  layouts/
    BaseLayout.astro                   # HTML head, meta, hreflang, JSON-LD, fonts
    BlogPostLayout.astro               # Blog post page layout
  components/
    SkipToContent.astro                # Accessibility: skip link
    Nav.astro                          # Sticky nav with hamburger + lang toggle
    Hero.astro                         # Hero section
    SectionDivider.astro               # Gradient line divider
    KompetenzItem.astro                # Single competence card (text + image)
    Kompetenzen.astro                  # Competences section (4 items)
    BlogCard.astro                     # Single blog post card
    Insights.astro                     # Blog/insights section
    ContactForm.astro                  # Contact form with Formspree AJAX
    Kontakt.astro                      # Contact section (form + info)
    Footer.astro                       # Footer with legal links
  pages/
    index.astro                        # DE landing page
    impressum.astro                    # Impressum (DE only)
    datenschutz.astro                  # Datenschutz (DE only)
    404.astro                          # Custom 404 page
    blog/
      [...slug].astro                  # DE blog post pages
    en/
      index.astro                      # EN landing page
      blog/
        [...slug].astro                # EN blog post pages
  styles/
    fonts.css                          # @font-face declarations
  assets/
    images/                            # Self-hosted stock photos
      strategy.jpg
      due-diligence.jpg
      cloud-native.jpg
      ai-transformation.jpg
```

---

## Task 1: Project Scaffolding & Legacy Cleanup

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `public/CNAME`, `public/.well-known/` (copy from existing)
- Create: `.github/workflows/deploy.yml`
- Remove: `_config.yml`, `_data/`, `_includes/`, `_layouts/`, `_Infos/`, `pages/`, `down/`, `feed.xml`, `index.jade`, `index.html`, `Gemfile`, `Gemfile.lock`, `404.html`, `assets/` (old)

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feature/website-redesign
```

- [ ] **Step 2: Remove legacy Jekyll files**

```bash
rm -rf _config.yml _data/ _includes/ _layouts/ _Infos/ pages/ down/ feed.xml index.jade index.html Gemfile Gemfile.lock 404.html assets/
```

Keep: `.git/`, `.gitignore`, `CNAME`, `.well-known/`, `README.md`, `docs/`, `.superpowers/`

- [ ] **Step 3: Initialize Astro project**

```bash
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

If prompted about overwriting, allow it for config files.

- [ ] **Step 4: Install dependencies**

```bash
npm install astro@^5.0.0 @astrojs/sitemap @tailwindcss/vite tailwindcss @fontsource-variable/inter
```

- [ ] **Step 5: Configure astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.deicon.de',
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 6: Configure tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 7: Preserve CNAME and .well-known in public/**

```bash
mkdir -p public
echo "www.deicon.de" > public/CNAME
cp -r .well-known public/.well-known
rm -rf .well-known
```

- [ ] **Step 8: Create GitHub Actions deploy workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 9: Update .gitignore**

```
# Astro
node_modules/
dist/
.astro/

# Superpowers
.superpowers/

# Environment
.env
.env.*
```

- [ ] **Step 10: Create minimal src/pages/index.astro placeholder**

```astro
---
// src/pages/index.astro
---
<html lang="de">
  <head><title>deicon</title></head>
  <body><h1>deicon.de — coming soon</h1></body>
</html>
```

- [ ] **Step 11: Verify build**

```bash
npm run build
```

Expected: Build succeeds, outputs to `dist/`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project, remove legacy Jekyll files"
```

---

## Task 2: Self-Hosted Fonts & Base Styles

**Files:**
- Create: `src/styles/fonts.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create font CSS using @fontsource-variable**

```css
/* src/styles/fonts.css */
@import '@fontsource-variable/inter';
```

- [ ] **Step 2: Create global CSS with Tailwind and design tokens**

```css
/* src/styles/global.css */
@import 'tailwindcss';
@import './fonts.css';

@theme {
  --color-primary: #1a2744;
  --color-darker: #0f1a2e;
  --color-darkest: #0a1220;
  --color-accent: #e8651a;
  --color-text-primary: #ffffff;
  --color-text-secondary: #8899b0;
  --color-text-muted: #7788a0;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-accent-border: rgba(232, 101, 26, 0.15);

  --font-sans: 'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif;
}

/* Skip-to-content link */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 999;
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: var(--color-primary);
  font-weight: 700;
}
.skip-to-content:focus {
  left: 0;
}

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: add self-hosted Inter font and global styles with design tokens"
```

---

## Task 3: i18n Translations & Utilities

**Files:**
- Create: `src/i18n/translations.ts`
- Create: `src/i18n/utils.ts`

- [ ] **Step 1: Create translations file**

```typescript
// src/i18n/translations.ts
export const languages = {
  de: 'Deutsch',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'de';

export const translations = {
  de: {
    'nav.kompetenzen': 'Kompetenzen',
    'nav.insights': 'Insights',
    'nav.kontakt': 'Kontakt',
    'hero.headline': 'Wir machen Technologie zur Strategie.',
    'hero.services': 'IT Strategy · IT Due Diligence · Cloud Native · AI Transformation',
    'section.kompetenzen': 'Kompetenzen',
    'section.insights': 'Insights',
    'section.kontakt': 'Kontakt',
    'kompetenz.01.title': 'IT Strategy',
    'kompetenz.01.description': 'Technologische Weichenstellungen, die Ihr Unternehmen voranbringen. Wir verbinden Geschäftsziele mit technischer Exzellenz — von der Roadmap bis zur Umsetzungsbegleitung.',
    'kompetenz.01.keywords': 'Roadmapping,Tech Radar,Architecture Review,Make or Buy',
    'kompetenz.02.title': 'IT Due Diligence',
    'kompetenz.02.description': 'Fundierte technische Bewertung von Softwareplattformen, Architekturen und Teams — für Investitionsentscheidungen mit Substanz. Wir liefern Klarheit, wo Komplexität herrscht.',
    'kompetenz.02.keywords': 'Code Quality,Tech Debt,Team Evaluation,Risk Analysis',
    'kompetenz.03.title': 'Cloud Native Architectures',
    'kompetenz.03.description': 'Moderne Architekturen für skalierbare, resiliente Systeme. Von der Legacy-Migration bis zum Cloud-nativen Neubau — pragmatisch und auf Ihre Anforderungen zugeschnitten.',
    'kompetenz.03.keywords': 'Kubernetes,Microservices,CI/CD,IaC',
    'kompetenz.04.title': 'AI Transformation',
    'kompetenz.04.description': 'KI strategisch einsetzen — nicht als Buzzword, sondern als Wertschöpfungshebel in Ihren Geschäftsprozessen. Von der Potenzialanalyse bis zur produktiven Integration.',
    'kompetenz.04.keywords': 'LLM Integration,AI Readiness,Process Automation,RAG',
    'contact.name': 'Ihr Name',
    'contact.email': 'E-Mail',
    'contact.message': 'Nachricht',
    'contact.consent': 'Ich stimme der Verarbeitung meiner Daten gemäß der',
    'contact.privacy': 'Datenschutzerklärung',
    'contact.consent.suffix': 'zu.',
    'contact.submit': 'Nachricht senden',
    'contact.success': 'Vielen Dank! Wir melden uns bei Ihnen.',
    'contact.error': 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    'contact.address.title': 'Adresse',
    'contact.phone.title': 'Telefon',
    'contact.email.title': 'E-Mail',
    'footer.impressum': 'Impressum',
    'footer.datenschutz': 'Datenschutz',
    'blog.back': 'Zurück zur Startseite',
    '404.title': 'Seite nicht gefunden',
    '404.message': 'Die angeforderte Seite existiert nicht.',
    '404.back': 'Zurück zur Startseite',
  },
  en: {
    'nav.kompetenzen': 'Expertise',
    'nav.insights': 'Insights',
    'nav.kontakt': 'Contact',
    'hero.headline': 'We turn technology into strategy.',
    'hero.services': 'IT Strategy · IT Due Diligence · Cloud Native · AI Transformation',
    'section.kompetenzen': 'Expertise',
    'section.insights': 'Insights',
    'section.kontakt': 'Contact',
    'kompetenz.01.title': 'IT Strategy',
    'kompetenz.01.description': 'Technology decisions that move your business forward. We connect business goals with technical excellence — from roadmapping to implementation support.',
    'kompetenz.01.keywords': 'Roadmapping,Tech Radar,Architecture Review,Make or Buy',
    'kompetenz.02.title': 'IT Due Diligence',
    'kompetenz.02.description': 'Thorough technical assessment of software platforms, architectures, and teams — for investment decisions with substance. We deliver clarity where complexity reigns.',
    'kompetenz.02.keywords': 'Code Quality,Tech Debt,Team Evaluation,Risk Analysis',
    'kompetenz.03.title': 'Cloud Native Architectures',
    'kompetenz.03.description': 'Modern architectures for scalable, resilient systems. From legacy migration to cloud-native builds — pragmatic and tailored to your requirements.',
    'kompetenz.03.keywords': 'Kubernetes,Microservices,CI/CD,IaC',
    'kompetenz.04.title': 'AI Transformation',
    'kompetenz.04.description': 'Deploy AI strategically — not as a buzzword, but as a value driver in your business processes. From potential analysis to production integration.',
    'kompetenz.04.keywords': 'LLM Integration,AI Readiness,Process Automation,RAG',
    'contact.name': 'Your Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.consent': 'I agree to the processing of my data according to the',
    'contact.privacy': 'Privacy Policy',
    'contact.consent.suffix': '.',
    'contact.submit': 'Send Message',
    'contact.success': 'Thank you! We will get back to you.',
    'contact.error': 'Something went wrong. Please try again.',
    'contact.address.title': 'Address',
    'contact.phone.title': 'Phone',
    'contact.email.title': 'Email',
    'footer.impressum': 'Legal Notice',
    'footer.datenschutz': 'Privacy Policy',
    'blog.back': 'Back to homepage',
    '404.title': 'Page not found',
    '404.message': 'The requested page does not exist.',
    '404.back': 'Back to homepage',
  },
} as const;
```

- [ ] **Step 2: Create i18n utilities**

```typescript
// src/i18n/utils.ts
import { defaultLang, translations, type Lang } from './translations';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof translations[typeof defaultLang]): string {
    return translations[lang][key] || translations[defaultLang][key];
  };
}

export function getLocalePath(lang: Lang, path: string = ''): string {
  if (lang === defaultLang) return `/${path}`;
  return `/${lang}/${path}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'de' ? 'en' : 'de';
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n translations and utility functions"
```

---

## Task 4: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SkipToContent.astro`

- [ ] **Step 1: Create SkipToContent component**

Add `'skip': 'Zum Inhalt springen'` to `translations.de` and `'skip': 'Skip to content'` to `translations.en` in `src/i18n/translations.ts`.

```astro
---
// src/components/SkipToContent.astro
import { type Lang } from '@/i18n/translations';
import { useTranslations } from '@/i18n/utils';

interface Props { lang: Lang; }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<a href="#main-content" class="skip-to-content">
  {t('skip')}
</a>
```

- [ ] **Step 2: Create BaseLayout with meta, hreflang, JSON-LD**

```astro
---
// src/layouts/BaseLayout.astro
import SkipToContent from '@/components/SkipToContent.astro';
import '@/styles/global.css';
import { type Lang } from '@/i18n/translations';
import { getLocalePath, getAlternateLang } from '@/i18n/utils';

interface Props {
  title: string;
  description: string;
  lang: Lang;
  canonicalPath?: string;
}

const { title, description, lang, canonicalPath = '' } = Astro.props;
const altLang = getAlternateLang(lang);
const siteUrl = 'https://www.deicon.de';
const canonicalUrl = `${siteUrl}${getLocalePath(lang, canonicalPath)}`;
const alternateUrl = `${siteUrl}${getLocalePath(altLang, canonicalPath)}`;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />

    <link rel="canonical" href={canonicalUrl} />
    <link rel="alternate" hreflang="de" href={`${siteUrl}${getLocalePath('de', canonicalPath)}`} />
    <link rel="alternate" hreflang="en" href={`${siteUrl}${getLocalePath('en', canonicalPath)}`} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <script type="application/ld+json" set:html={JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'deicon it solutions GmbH & Co. KG',
      url: siteUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Teutonenweg 4',
        addressLocality: 'Taunusstein',
        postalCode: '65232',
        addressCountry: 'DE',
      },
      telephone: '+49612897907 10',
      email: 'info@deicon.de',
    })} />
  </head>
  <body class="bg-darker font-sans text-text-secondary">
    <SkipToContent lang={lang} />
    <slot />

    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.15 }
      );
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    </script>
  </body>
</html>
```

- [ ] **Step 3: Update src/pages/index.astro to use layout**

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout
  title="deicon it solutions — IT Strategy, Due Diligence, Cloud Native, AI"
  description="deicon it solutions: IT Strategy, IT Due Diligence, Cloud Native Architectures und AI Transformation für technische Entscheidungsträger."
  lang="de"
>
  <main id="main-content">
    <h1>deicon — coming soon</h1>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify build and dev server**

```bash
npm run build
npm run dev
```

Check http://localhost:4321 — page should render with correct `<html lang="de">`, meta tags, and JSON-LD.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/ src/components/SkipToContent.astro src/pages/index.astro
git commit -m "feat: add BaseLayout with SEO meta, hreflang, JSON-LD, and skip-to-content"
```

---

## Task 5: Nav Component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create Nav component**

```astro
---
// src/components/Nav.astro
import { type Lang } from '@/i18n/translations';
import { useTranslations, getLocalePath, getAlternateLang } from '@/i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const altLang = getAlternateLang(lang);
const langPrefix = lang === 'de' ? '' : '/en';
---

<nav class="sticky top-0 z-50 flex items-center justify-between bg-primary px-6 py-5 border-b border-border lg:px-12" aria-label="Main navigation">
  <a href={getLocalePath(lang)} class="text-[22px] font-extrabold text-text-primary tracking-tight">
    deicon<span class="text-accent">.</span>
  </a>

  {/* Desktop nav */}
  <div class="hidden items-center gap-6 text-sm md:flex">
    <a href={`${langPrefix}/#kompetenzen`} class="text-text-secondary hover:text-text-primary transition-colors">{t('nav.kompetenzen')}</a>
    <a href={`${langPrefix}/#insights`} class="text-text-secondary hover:text-text-primary transition-colors">{t('nav.insights')}</a>
    <a href={`${langPrefix}/#kontakt`} class="text-text-secondary hover:text-text-primary transition-colors">{t('nav.kontakt')}</a>
  </div>

  <div class="flex items-center gap-4">
    <a
      href={getLocalePath(altLang)}
      class="rounded border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
    >
      {lang === 'de' ? (<><span class="font-semibold text-text-primary">DE</span> / EN</>) : (<>DE / <span class="font-semibold text-text-primary">EN</span></>)}
    </a>

    {/* Hamburger button (mobile) */}
    <button
      id="menu-toggle"
      class="md:hidden text-text-secondary hover:text-text-primary"
      aria-label="Menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path id="menu-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  {/* Mobile menu overlay */}
  <div
    id="mobile-menu"
    class="fixed inset-0 z-40 hidden flex-col items-center justify-center gap-8 bg-primary/95 backdrop-blur-sm text-lg md:hidden"
  >
    <button id="menu-close" class="absolute top-5 right-6 text-text-secondary hover:text-text-primary" aria-label="Close menu">
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <a href={`${langPrefix}/#kompetenzen`} class="mobile-nav-link text-text-secondary hover:text-text-primary transition-colors">{t('nav.kompetenzen')}</a>
    <a href={`${langPrefix}/#insights`} class="mobile-nav-link text-text-secondary hover:text-text-primary transition-colors">{t('nav.insights')}</a>
    <a href={`${langPrefix}/#kontakt`} class="mobile-nav-link text-text-secondary hover:text-text-primary transition-colors">{t('nav.kontakt')}</a>
  </div>
</nav>

<script>
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const close = document.getElementById('menu-close');
  const links = menu?.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    menu?.classList.remove('hidden');
    menu?.classList.add('flex');
    toggle?.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    menu?.classList.add('hidden');
    menu?.classList.remove('flex');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  toggle?.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  links?.forEach((link) => link.addEventListener('click', closeMenu));
</script>
```

- [ ] **Step 2: Add Nav to index.astro**

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
---

<BaseLayout
  title="deicon it solutions — IT Strategy, Due Diligence, Cloud Native, AI"
  description="deicon it solutions: IT Strategy, IT Due Diligence, Cloud Native Architectures und AI Transformation für technische Entscheidungsträger."
  lang="de"
>
  <Nav lang="de" />
  <main id="main-content">
    <p class="p-12 text-text-secondary">Content coming soon...</p>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Check: sticky nav, hamburger on mobile (< 768px), DE/EN toggle link, anchor links.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "feat: add Nav component with mobile hamburger and language toggle"
```

---

## Task 6: Hero & SectionDivider Components

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/SectionDivider.astro`

- [ ] **Step 1: Create SectionDivider**

```astro
---
// src/components/SectionDivider.astro
---
<div class="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" role="separator"></div>
```

- [ ] **Step 2: Create Hero component**

```astro
---
// src/components/Hero.astro
import { type Lang } from '@/i18n/translations';
import { useTranslations } from '@/i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const services = ['IT Strategy', 'IT Due Diligence', 'Cloud Native', 'AI Transformation'];
---

<section class="relative overflow-hidden bg-primary px-6 py-24 text-center lg:px-12 lg:py-[100px] lg:pb-[88px]">
  <h1 class="relative z-10 text-[28px] font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-[44px] lg:tracking-[-1px]">
    {t('hero.headline')}
  </h1>
  <div class="relative z-10 mx-auto mt-5 h-[3px] w-12 bg-accent"></div>
  <div class="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-x-1 text-sm uppercase tracking-[2px] text-text-secondary lg:text-base">
    {services.map((service, i) => (
      <span>
        {i > 0 && <span class="text-accent mx-2">·</span>}
        {service}
      </span>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Add to index.astro**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Hero from '@/components/Hero.astro';
import SectionDivider from '@/components/SectionDivider.astro';
---

<BaseLayout
  title="deicon it solutions — IT Strategy, Due Diligence, Cloud Native, AI"
  description="deicon it solutions: IT Strategy, IT Due Diligence, Cloud Native Architectures und AI Transformation für technische Entscheidungsträger."
  lang="de"
>
  <Nav lang="de" />
  <main id="main-content">
    <Hero lang="de" />
    <SectionDivider />
    <p class="p-12 text-text-secondary">More sections coming...</p>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify dev server**

Check: hero renders centered, responsive headline sizing, accent bar, service keywords with orange dots.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/components/SectionDivider.astro src/pages/index.astro
git commit -m "feat: add Hero and SectionDivider components"
```

---

## Task 7: Kompetenzen Section with Stock Photos

**Files:**
- Create: `src/components/KompetenzItem.astro`
- Create: `src/components/Kompetenzen.astro`
- Create: `src/assets/images/` (download 4 stock photos)

- [ ] **Step 1: Download and save stock photos**

Download 4 images from Unsplash (royalty-free) and save to `src/assets/images/`. Use landscape orientation, ~1200px wide. Name them:
- `strategy.jpg` — office/strategy/whiteboard scene
- `due-diligence.jpg` — business analysis/documents scene
- `cloud-native.jpg` — data center/server/globe scene
- `ai-transformation.jpg` — AI/technology visualization

```bash
mkdir -p src/assets/images
# Download images (example URLs — replace with actual Unsplash downloads)
curl -L "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80" -o src/assets/images/strategy.jpg
curl -L "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80" -o src/assets/images/due-diligence.jpg
curl -L "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80" -o src/assets/images/cloud-native.jpg
curl -L "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80" -o src/assets/images/ai-transformation.jpg
```

- [ ] **Step 2: Create KompetenzItem component**

```astro
---
// src/components/KompetenzItem.astro
import { Image } from 'astro:assets';

interface Props {
  number: string;
  title: string;
  description: string;
  keywords: string[];
  image: ImageMetadata;
  imageAlt: string;
  reverse?: boolean;
}

const { number, title, description, keywords, image, imageAlt, reverse = false } = Astro.props;
---

<div class={`reveal mx-auto mb-12 max-w-[1060px] overflow-hidden rounded-xl border border-border last:mb-0 ${reverse ? 'kompetenz-reverse' : ''}`}>
  <div class={`grid grid-cols-1 lg:grid-cols-2 ${reverse ? 'lg:[direction:rtl]' : ''}`}>
    <div class={`flex flex-col justify-center bg-surface p-8 lg:p-12 ${reverse ? 'lg:[direction:ltr]' : ''}`}>
      <div class="text-5xl font-extrabold leading-none tracking-tight text-accent/15">{number}</div>
      <h3 class="mt-2 text-2xl font-extrabold tracking-tight text-text-primary lg:text-[28px]">{title}</h3>
      <p class="mt-4 text-[15px] leading-relaxed text-text-secondary">{description}</p>
      <div class="mt-5 h-0.5 w-8 bg-accent"></div>
      <div class="mt-4 flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <span class="rounded border border-accent-border bg-accent/8 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-accent">
            {kw}
          </span>
        ))}
      </div>
    </div>
    <div class={`relative min-h-[240px] overflow-hidden lg:min-h-[320px] ${reverse ? 'lg:[direction:ltr]' : ''}`}>
      <Image
        src={image}
        alt={imageAlt}
        width={800}
        loading="lazy"
        class="h-full w-full object-cover brightness-[0.55] saturate-[0.8] transition-all duration-400 hover:brightness-[0.65] hover:saturate-[0.9] hover:scale-[1.03]"
      />
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-darker/70 to-darker/20"></div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Create Kompetenzen section component**

```astro
---
// src/components/Kompetenzen.astro
import KompetenzItem from './KompetenzItem.astro';
import { type Lang } from '@/i18n/translations';
import { useTranslations } from '@/i18n/utils';

import strategyImg from '@/assets/images/strategy.jpg';
import dueDiligenceImg from '@/assets/images/due-diligence.jpg';
import cloudNativeImg from '@/assets/images/cloud-native.jpg';
import aiImg from '@/assets/images/ai-transformation.jpg';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);

const items = [
  { num: '01', key: '01' as const, image: strategyImg, alt: 'IT Strategy consulting' },
  { num: '02', key: '02' as const, image: dueDiligenceImg, alt: 'IT Due Diligence assessment' },
  { num: '03', key: '03' as const, image: cloudNativeImg, alt: 'Cloud Native architecture' },
  { num: '04', key: '04' as const, image: aiImg, alt: 'AI Transformation' },
];
---

<section id="kompetenzen" class="bg-darker px-6 py-20 lg:px-12" aria-labelledby="kompetenzen-title">
  <h2 id="kompetenzen-title" class="mb-12 text-xs font-semibold uppercase tracking-[3px] text-accent">
    {t('section.kompetenzen')}
  </h2>
  {items.map((item, i) => (
    <KompetenzItem
      number={item.num}
      title={t(`kompetenz.${item.key}.title`)}
      description={t(`kompetenz.${item.key}.description`)}
      keywords={t(`kompetenz.${item.key}.keywords`).split(',')}
      image={item.image}
      imageAlt={item.alt}
      reverse={i % 2 === 1}
    />
  ))}
</section>
```

- [ ] **Step 4: Add to index.astro**

Add below `<SectionDivider />`:

```astro
<Kompetenzen lang="de" />
<SectionDivider />
```

- [ ] **Step 5: Verify dev server**

Check: 4 stacked items, alternating layout, images load and darken, scroll-reveal animates on scroll, keywords render as tags. Test mobile stacking.

- [ ] **Step 6: Commit**

```bash
git add src/components/KompetenzItem.astro src/components/Kompetenzen.astro src/assets/images/ src/pages/index.astro
git commit -m "feat: add Kompetenzen section with scroll-reveal and stock photos"
```

---

## Task 8: Blog Content Collection & Insights Section

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/de/placeholder.md`
- Create: `src/content/blog/en/placeholder.md`
- Create: `src/components/BlogCard.astro`
- Create: `src/components/Insights.astro`

- [ ] **Step 1: Create content collection schema**

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    lang: z.enum(['de', 'en']),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create placeholder blog posts**

```markdown
---
# src/content/blog/de/cloud-native-kein-selbstzweck.md
title: "Cloud Native ist kein Selbstzweck"
date: 2026-03-01
excerpt: "Warum die Entscheidung für Kubernetes & Co. eine strategische sein muss — und was dabei oft vergessen wird."
lang: de
tags: ["cloud-native", "strategy"]
---

Cloud Native ist kein Selbstzweck. Dieser Beitrag wird in Kürze veröffentlicht.
```

```markdown
---
# src/content/blog/en/cloud-native-not-an-end.md
title: "Cloud Native Is Not an End in Itself"
date: 2026-03-01
excerpt: "Why the decision for Kubernetes & Co. must be a strategic one — and what is often overlooked."
lang: en
tags: ["cloud-native", "strategy"]
---

Cloud Native is not an end in itself. This post will be published soon.
```

- [ ] **Step 3: Create BlogCard component**

```astro
---
// src/components/BlogCard.astro
import { type Lang } from '@/i18n/translations';
import { getLocalePath } from '@/i18n/utils';

interface Props {
  title: string;
  date: Date;
  excerpt: string;
  slug: string;
  lang: Lang;
}

const { title, date, excerpt, slug, lang } = Astro.props;
const formattedDate = date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
  year: 'numeric',
  month: 'long',
});
const href = `${getLocalePath(lang)}blog/${slug}/`;
---

<a href={href} class="group block rounded-lg border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-accent/30">
  <div class="text-xs font-semibold text-accent">{formattedDate}</div>
  <h3 class="mt-2 text-base font-bold leading-snug text-text-primary group-hover:text-accent transition-colors">{title}</h3>
  <p class="mt-2 text-[13px] leading-relaxed text-text-secondary">{excerpt}</p>
</a>
```

- [ ] **Step 4: Create Insights section**

```astro
---
// src/components/Insights.astro
import { getCollection } from 'astro:content';
import BlogCard from './BlogCard.astro';
import { type Lang } from '@/i18n/translations';
import { useTranslations } from '@/i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);

const allPosts = await getCollection('blog', (post) => post.data.lang === lang);
const posts = allPosts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);
---

{posts.length > 0 && (
  <section id="insights" class="bg-primary px-6 py-20 lg:px-12" aria-labelledby="insights-title">
    <h2 id="insights-title" class="mb-12 text-xs font-semibold uppercase tracking-[3px] text-accent">
      {t('section.insights')}
    </h2>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const slug = post.id.startsWith(`${lang}/`) ? post.id.slice(lang.length + 1) : post.id;
        return (
          <BlogCard
            title={post.data.title}
            date={post.data.date}
            excerpt={post.data.excerpt}
            slug={slug}
            lang={lang}
          />
        );
      })}
    </div>
  </section>
)}
```

- [ ] **Step 5: Add to index.astro**

Add below second `<SectionDivider />`:

```astro
<Insights lang="de" />
<SectionDivider />
```

- [ ] **Step 6: Verify dev server**

Check: blog cards render with date, title, excerpt. Section hidden if 0 posts. Responsive grid (1/2/3 columns).

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/content/ src/components/BlogCard.astro src/components/Insights.astro src/pages/index.astro
git commit -m "feat: add blog content collection and Insights section"
```

---

## Task 9: Contact Section with Formspree AJAX

**Files:**
- Create: `src/components/ContactForm.astro`
- Create: `src/components/Kontakt.astro`

- [ ] **Step 1: Create ContactForm component**

```astro
---
// src/components/ContactForm.astro
import { type Lang } from '@/i18n/translations';
import { useTranslations, getLocalePath } from '@/i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const datenschutzUrl = lang === 'de' ? '/datenschutz/' : '/datenschutz/';
---

<form id="contact-form" class="space-y-3">
  <div>
    <label for="name" class="mb-1.5 block text-[13px] text-text-secondary">{t('contact.name')}</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="w-full rounded-md border border-border bg-white/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent"
    />
  </div>
  <div>
    <label for="email" class="mb-1.5 block text-[13px] text-text-secondary">{t('contact.email')}</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="w-full rounded-md border border-border bg-white/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent"
    />
  </div>
  <div>
    <label for="message" class="mb-1.5 block text-[13px] text-text-secondary">{t('contact.message')}</label>
    <textarea
      id="message"
      name="message"
      required
      rows="4"
      class="w-full resize-y rounded-md border border-border bg-white/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent"
    ></textarea>
  </div>
  <div class="flex items-start gap-2">
    <input
      type="checkbox"
      id="consent"
      name="consent"
      required
      class="mt-1 accent-accent"
    />
    <label for="consent" class="text-[13px] text-text-secondary">
      {t('contact.consent')} <a href={datenschutzUrl} class="text-accent underline">{t('contact.privacy')}</a>{t('contact.consent.suffix')}
    </label>
  </div>
  <button
    type="submit"
    class="rounded-md bg-accent px-8 py-3 text-sm font-bold text-primary transition-colors hover:bg-accent/90"
  >
    {t('contact.submit')}
  </button>
  <div id="form-status" class="hidden rounded-md p-3 text-sm" role="alert" aria-live="polite"
    data-success={t('contact.success')}
    data-error={t('contact.error')}
  ></div>
</form>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const status = document.getElementById('form-status');
  const successMsg = status?.dataset.success ?? '';
  const errorMsg = status?.dataset.error ?? '';

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.delete('consent');

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.classList.add('hidden');
        if (status) {
          status.textContent = successMsg;
          status.className = 'rounded-md bg-accent/10 border border-accent/30 p-3 text-sm text-accent';
        }
      } else {
        if (status) {
          status.textContent = errorMsg;
          status.className = 'rounded-md bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400';
        }
      }
    } catch {
      if (status) {
        status.textContent = errorMsg;
        status.className = 'rounded-md bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400';
      }
    }
  });
</script>
```

**Note:** Replace `YOUR_FORM_ID` with actual Formspree form ID once created for info@deicon.de.

- [ ] **Step 2: Create Kontakt section**

```astro
---
// src/components/Kontakt.astro
import ContactForm from './ContactForm.astro';
import { type Lang } from '@/i18n/translations';
import { useTranslations } from '@/i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);
---

<section id="kontakt" class="bg-darker px-6 py-20 lg:px-12" aria-labelledby="kontakt-title">
  <h2 id="kontakt-title" class="mb-12 text-xs font-semibold uppercase tracking-[3px] text-accent">
    {t('section.kontakt')}
  </h2>
  <div class="mx-auto grid max-w-[960px] grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr]">
    <ContactForm lang={lang} />
    <div>
      <h3 class="text-sm font-bold text-text-primary">{t('contact.address.title')}</h3>
      <div class="mt-1.5 space-y-0.5 text-sm text-text-secondary">
        <p>deicon it solutions GmbH & Co. KG</p>
        <p>Teutonenweg 4</p>
        <p>65232 Taunusstein</p>
      </div>

      <h3 class="mt-5 text-sm font-bold text-text-primary">{t('contact.phone.title')}</h3>
      <p class="mt-1.5 text-sm text-text-secondary">06128 / 9 790 710</p>

      <h3 class="mt-5 text-sm font-bold text-text-primary">{t('contact.email.title')}</h3>
      <p class="mt-1.5 text-sm text-text-secondary">
        <a href="mailto:info@deicon.de" class="text-text-secondary hover:text-accent transition-colors">info@deicon.de</a>
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add to index.astro**

Add below the Insights `<SectionDivider />`:

```astro
<Kontakt lang="de" />
```

- [ ] **Step 4: Verify dev server**

Check: form renders with all fields, consent checkbox, styled inputs, company info sidebar. Test mobile stacking.

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactForm.astro src/components/Kontakt.astro src/pages/index.astro
git commit -m "feat: add Kontakt section with Formspree AJAX contact form"
```

---

## Task 10: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Footer**

```astro
---
// src/components/Footer.astro
import { type Lang } from '@/i18n/translations';
import { useTranslations } from '@/i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const year = new Date().getFullYear();
---

<footer class="flex flex-col items-center justify-between gap-2 border-t border-border/50 bg-darkest px-6 py-5 text-xs text-text-muted sm:flex-row lg:px-12">
  <span>&copy; {year} deicon it solutions GmbH &amp; Co. KG</span>
  <span>
    <a href="/impressum/" class="hover:text-text-secondary transition-colors">{t('footer.impressum')}</a>
    <span class="mx-1">&middot;</span>
    <a href="/datenschutz/" class="hover:text-text-secondary transition-colors">{t('footer.datenschutz')}</a>
  </span>
</footer>
```

- [ ] **Step 2: Add to index.astro**

Add after `<Kontakt />`, outside `</main>`:

```astro
  </main>
  <Footer lang="de" />
</BaseLayout>
```

- [ ] **Step 3: Verify and commit**

```bash
npm run build
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Footer component"
```

---

## Task 11: Complete DE & EN Landing Pages

**Files:**
- Modify: `src/pages/index.astro` (finalize)
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Finalize DE landing page**

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Hero from '@/components/Hero.astro';
import SectionDivider from '@/components/SectionDivider.astro';
import Kompetenzen from '@/components/Kompetenzen.astro';
import Insights from '@/components/Insights.astro';
import Kontakt from '@/components/Kontakt.astro';
import Footer from '@/components/Footer.astro';
---

<BaseLayout
  title="deicon it solutions — IT Strategy, Due Diligence, Cloud Native, AI"
  description="deicon it solutions: IT Strategy, IT Due Diligence, Cloud Native Architectures und AI Transformation für technische Entscheidungsträger."
  lang="de"
>
  <Nav lang="de" />
  <main id="main-content">
    <Hero lang="de" />
    <SectionDivider />
    <Kompetenzen lang="de" />
    <SectionDivider />
    <Insights lang="de" />
    <SectionDivider />
    <Kontakt lang="de" />
  </main>
  <Footer lang="de" />
</BaseLayout>
```

- [ ] **Step 2: Create EN landing page**

```astro
---
// src/pages/en/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Hero from '@/components/Hero.astro';
import SectionDivider from '@/components/SectionDivider.astro';
import Kompetenzen from '@/components/Kompetenzen.astro';
import Insights from '@/components/Insights.astro';
import Kontakt from '@/components/Kontakt.astro';
import Footer from '@/components/Footer.astro';
---

<BaseLayout
  title="deicon it solutions — IT Strategy, Due Diligence, Cloud Native, AI"
  description="deicon it solutions: IT Strategy, IT Due Diligence, Cloud Native Architectures and AI Transformation for technical decision makers."
  lang="en"
>
  <Nav lang="en" />
  <main id="main-content">
    <Hero lang="en" />
    <SectionDivider />
    <Kompetenzen lang="en" />
    <SectionDivider />
    <Insights lang="en" />
    <SectionDivider />
    <Kontakt lang="en" />
  </main>
  <Footer lang="en" />
</BaseLayout>
```

- [ ] **Step 3: Verify both pages**

```bash
npm run dev
```

Check http://localhost:4321/ (DE) and http://localhost:4321/en/ (EN). Verify:
- All sections render
- Language toggle switches between pages
- Anchor links work
- Content is in the correct language

- [ ] **Step 4: Commit**

```bash
git add src/pages/
git commit -m "feat: complete DE and EN landing pages"
```

---

## Task 12: Blog Post Pages

**Files:**
- Create: `src/layouts/BlogPostLayout.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/pages/en/blog/[...slug].astro`

- [ ] **Step 1: Create BlogPostLayout**

```astro
---
// src/layouts/BlogPostLayout.astro
import BaseLayout from './BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
import { type Lang } from '@/i18n/translations';
import { useTranslations, getLocalePath } from '@/i18n/utils';

interface Props {
  title: string;
  date: Date;
  lang: Lang;
  slug: string;
}

const { title, date, lang, slug } = Astro.props;
const t = useTranslations(lang);
const formattedDate = date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout
  title={`${title} — deicon it solutions`}
  description={title}
  lang={lang}
  canonicalPath={`blog/${slug}/`}
>
  <Nav lang={lang} />
  <main id="main-content" class="mx-auto max-w-3xl px-6 py-16 lg:px-12">
    <a href={getLocalePath(lang)} class="text-sm text-accent hover:underline">&larr; {t('blog.back')}</a>
    <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-text-primary lg:text-4xl">{title}</h1>
    <p class="mt-3 text-sm text-text-secondary">{formattedDate}</p>
    <div class="prose-invert mt-10 max-w-none text-text-secondary leading-relaxed [&_h2]:text-text-primary [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_a]:text-accent [&_a]:underline [&_code]:text-accent/80">
      <slot />
    </div>
  </main>
  <Footer lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Create DE blog route**

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, render } from 'astro:content';
import BlogPostLayout from '@/layouts/BlogPostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', (post) => post.data.lang === 'de');
  return posts.map((post) => {
    const slug = post.id.startsWith('de/') ? post.id.slice(3) : post.id;
    return { params: { slug }, props: { post } };
  });
}

const { post } = Astro.props;
const { Content } = await render(post);
const slug = post.id.startsWith('de/') ? post.id.slice(3) : post.id;
---

<BlogPostLayout title={post.data.title} date={post.data.date} lang="de" slug={slug}>
  <Content />
</BlogPostLayout>
```

- [ ] **Step 3: Create EN blog route**

```astro
---
// src/pages/en/blog/[...slug].astro
import { getCollection, render } from 'astro:content';
import BlogPostLayout from '@/layouts/BlogPostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', (post) => post.data.lang === 'en');
  return posts.map((post) => {
    const slug = post.id.startsWith('en/') ? post.id.slice(3) : post.id;
    return { params: { slug }, props: { post } };
  });
}

const { post } = Astro.props;
const { Content } = await render(post);
const slug = post.id.startsWith('en/') ? post.id.slice(3) : post.id;
---

<BlogPostLayout title={post.data.title} date={post.data.date} lang="en" slug={slug}>
  <Content />
</BlogPostLayout>
```

- [ ] **Step 4: Verify blog post pages**

```bash
npm run dev
```

Navigate to a blog card on the landing page, click it, verify the blog post page renders with layout, back link, and content.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BlogPostLayout.astro src/pages/blog/ src/pages/en/blog/
git commit -m "feat: add blog post pages with dynamic routing for DE and EN"
```

---

## Task 13: Impressum, Datenschutz & 404 Pages

**Files:**
- Create: `src/pages/impressum.astro`
- Create: `src/pages/datenschutz.astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create Impressum page**

```astro
---
// src/pages/impressum.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
---

<BaseLayout title="Impressum — deicon it solutions" description="Impressum der deicon it solutions GmbH & Co. KG" lang="de" canonicalPath="impressum/">
  <Nav lang="de" />
  <main id="main-content" class="mx-auto max-w-3xl px-6 py-16 lg:px-12">
    <h1 class="text-3xl font-extrabold tracking-tight text-text-primary">Impressum</h1>
    <div class="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-8 [&_h2]:mb-2">
      <p>
        <strong class="text-text-primary">deicon it solutions GmbH & Co. KG</strong><br />
        Teutonenweg 4<br />
        65232 Taunusstein
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: 06128 / 9 790 710<br />
        E-Mail: info@deicon.de
      </p>

      <h2>Vertretungsberechtigter Gesellschafter</h2>
      <p>deicon it solutions Verwaltungs-GmbH, vertreten durch Geschäftsführer Dieter Eickstädt</p>

      <h2>Registereintrag</h2>
      <p>
        <!-- TODO: Add actual HRA/HRB numbers -->
        Eingetragen im Handelsregister.<br />
        Registergericht: Amtsgericht Wiesbaden
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        <!-- TODO: Add actual USt-IdNr. -->
        Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE [Nummer ergänzen]
      </p>

      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>Dieter Eickstädt, Teutonenweg 4, 65232 Taunusstein</p>
    </div>
  </main>
  <Footer lang="de" />
</BaseLayout>
```

- [ ] **Step 2: Create Datenschutz page**

```astro
---
// src/pages/datenschutz.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
---

<BaseLayout title="Datenschutzerklärung — deicon it solutions" description="Datenschutzerklärung der deicon it solutions GmbH & Co. KG" lang="de" canonicalPath="datenschutz/">
  <Nav lang="de" />
  <main id="main-content" class="mx-auto max-w-3xl px-6 py-16 lg:px-12">
    <h1 class="text-3xl font-extrabold tracking-tight text-text-primary">Datenschutzerklärung</h1>
    <div class="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-4 [&_h3]:mb-1">

      <h2>1. Verantwortlicher</h2>
      <p>
        deicon it solutions GmbH & Co. KG<br />
        Teutonenweg 4, 65232 Taunusstein<br />
        E-Mail: info@deicon.de
      </p>

      <h2>2. Erhebung und Speicherung personenbezogener Daten</h2>
      <h3>Kontaktformular</h3>
      <p>
        Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben (Name, E-Mail-Adresse, Nachricht) zum Zwecke der Bearbeitung der Anfrage bei uns gespeichert. Diese Daten werden über den Dienst Formspree (Formspree Inc.) übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
      </p>

      <h3>Server-Log-Dateien</h3>
      <p>
        Der Hosting-Anbieter (GitHub Pages) erhebt automatisch Informationen in Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies umfasst: Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse.
      </p>

      <h2>3. Keine Cookies</h2>
      <p>Diese Website verwendet keine Cookies.</p>

      <h2>4. Keine externen Ressourcen</h2>
      <p>
        Alle Schriftarten und Bilder werden lokal von unserem Server bereitgestellt. Es werden keine externen Dienste (z.B. Google Fonts, CDNs) eingebunden, die personenbezogene Daten an Dritte übermitteln könnten.
      </p>

      <h2>5. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dazu an: info@deicon.de
      </p>

      <h2>6. Beschwerderecht</h2>
      <p>
        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
      </p>
    </div>
  </main>
  <Footer lang="de" />
</BaseLayout>
```

- [ ] **Step 3: Create 404 page**

**Note:** GitHub Pages serves a single `404.html` for all routes — it cannot be language-specific. German is used as the default since it's the primary language.

```astro
---
// src/pages/404.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
---

<BaseLayout title="404 — deicon it solutions" description="Seite nicht gefunden" lang="de">
  <Nav lang="de" />
  <main id="main-content" class="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
    <h1 class="text-6xl font-extrabold text-accent">404</h1>
    <p class="mt-4 text-lg text-text-secondary">Seite nicht gefunden</p>
    <p class="mt-2 text-sm text-text-secondary">Die angeforderte Seite existiert nicht.</p>
    <a href="/" class="mt-8 rounded-md bg-accent px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-accent/90">
      Zurück zur Startseite
    </a>
  </main>
  <Footer lang="de" />
</BaseLayout>
```

- [ ] **Step 4: Verify all pages**

```bash
npm run build
```

Check: all pages build successfully. Visit `/impressum/`, `/datenschutz/` in dev server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/impressum.astro src/pages/datenschutz.astro src/pages/404.astro
git commit -m "feat: add Impressum, Datenschutz, and 404 pages"
```

---

## Task 14: Final Build Verification & Cleanup

**Files:**
- Modify: `.gitignore` (ensure `.superpowers/` is excluded)

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: Clean build, no errors, outputs to `dist/`.

- [ ] **Step 2: Verify dist/ output**

Check that `dist/` contains:
- `index.html` (DE)
- `en/index.html` (EN)
- `impressum/index.html`
- `datenschutz/index.html`
- `404.html`
- `blog/*/index.html` (DE posts)
- `en/blog/*/index.html` (EN posts)
- `CNAME`
- `.well-known/`
- Optimized images in `_astro/`
- `sitemap-index.xml`

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Navigate through the entire site. Verify:
- Nav sticky behavior and mobile hamburger
- Hero responsive sizing
- Kompetenzen scroll reveal on scroll
- Blog cards link to post pages
- Contact form fields and validation (visual only — Formspree ID not yet set)
- Footer links to Impressum/Datenschutz
- Language toggle between DE and EN
- 404 page (visit a non-existent URL)

- [ ] **Step 4: Accessibility check**

Open Chrome DevTools > Lighthouse > Accessibility audit on both DE and EN pages. Target score: 90+.

- [ ] **Step 5: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final build verification and cleanup"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Project scaffolding & legacy cleanup | `astro.config.mjs`, `.github/workflows/deploy.yml` |
| 2 | Self-hosted fonts & base styles | `src/styles/global.css`, `src/styles/fonts.css` |
| 3 | i18n translations & utilities | `src/i18n/translations.ts`, `src/i18n/utils.ts` |
| 4 | Base layout with SEO | `src/layouts/BaseLayout.astro` |
| 5 | Nav component | `src/components/Nav.astro` |
| 6 | Hero & SectionDivider | `src/components/Hero.astro`, `src/components/SectionDivider.astro` |
| 7 | Kompetenzen with stock photos | `src/components/Kompetenzen.astro`, `src/components/KompetenzItem.astro` |
| 8 | Blog content collection & Insights | `src/content.config.ts`, `src/components/Insights.astro` |
| 9 | Contact form with Formspree | `src/components/ContactForm.astro`, `src/components/Kontakt.astro` |
| 10 | Footer | `src/components/Footer.astro` |
| 11 | Complete DE & EN landing pages | `src/pages/index.astro`, `src/pages/en/index.astro` |
| 12 | Blog post pages | `src/pages/blog/[...slug].astro`, `src/layouts/BlogPostLayout.astro` |
| 13 | Impressum, Datenschutz & 404 | `src/pages/impressum.astro`, `src/pages/datenschutz.astro`, `src/pages/404.astro` |
| 14 | Final build verification | All files |
