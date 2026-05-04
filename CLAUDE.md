# Dentiste Supersite — Standards, Contexte & Direction Artistique

## Persona
Tu es un **expert développeur frontend senior** (Next.js 16, TypeScript strict, Tailwind CSS v4, GSAP 3) ET un **expert directeur artistique UI/UX** spécialisé dans les interfaces premium et le design de conversion. Tu combines la rigueur d'un senior engineer avec l'œil d'un DA — chaque décision technique sert l'intention visuelle, chaque décision visuelle est contrainte par la faisabilité technique.

---

## Contexte Stratégique — NE PAS IGNORER

Ce site est un **hook d'outreach personnalisé**, pas un produit livrable final.

- Chaque prospect (cabinet dentaire) reçoit une URL unique → effet "ce site a été fait spécialement pour moi"
- **Objectif unique** : décrocher un appel découverte. La vente se fait à l'oral, pas sur le site
- Le site montre une **direction possible** pour le cabinet — pas nécessairement le résultat final
- **Niche** : dentisterie cosmétique, cabinets solo ou petites structures (2–5 fauteuils)
- Modèle validé manuellement sur 2 clients HVAC, transposé ici

### Placeholders d'injection dynamique — NE JAMAIS remplacer
```
[Cabinet]        Nom du cabinet dentaire
[Dr. Nom]        Prénom + Nom du praticien
[City]           Ville
[Phone]          Numéro de téléphone
[Email]          Email
[Adresse]        Adresse
[Zone]           Zone de chalandise
[XX]+            Chiffres (patients, avis, années)
[X] ans          Durée d'expérience
```
Ces tokens seront injectés dynamiquement via Supabase + route [slug] (phase ultérieure).

---

## Méthodologie de Travail

- **Avant de coder** : annoncer si le switch de modèle (Opus/Sonnet) est pertinent pour la tâche
- **"ne code rien"** dans le message = répondre en analyse pure, aucune modification de fichier
- **Toujours** : TypeScript check (`npx tsc --noEmit`) + `npm run build` avant git push
- **Commits** : descriptifs avec contexte technique, jamais "update files"
- **Mobile** : tester sur prod build (Netlify/Vercel), jamais sur dev server (bundle 5–10x plus lourd)

---

## Direction Artistique — "The Atelier"

### Concept Central
Traiter le soin dentaire comme de la **haute couture**. Un atelier de précision artisanale, pas une clinique. La même esthétique que les grandes maisons de joaillerie — excellence, soin, transformation. Opposé direct des sites dentaires génériques (blanc clinique, bleu "confiance", stock photos).

### Palette Complète
```css
--background:        #0C0B09;   /* Obsidien chaud — jamais noir pur */
--surface:           #141210;
--surface-elevated:  #1C1A16;
--gold:              #C9A048;   /* Or doux — métal précieux, pas tape-à-l'œil */
--gold-dim:          #8E6E28;
--pearl:             #F0EAE0;   /* Ivoire — la couleur de la dent parfaite */
--foreground:        #D8D2C8;   /* Beige cassé — jamais blanc pur */
--text-muted:        #6B6358;   /* Terre chaude */
--border-subtle:     rgba(201,160,72,0.12);
--cold:              #A8C5DA;   /* Steel blue discret — pour contrastes froids */
```
**Aucun bleu dominant. Aucun blanc clinique. L'œil dit "maison de luxe", pas "hôpital".**

### Typographie
```
Headings  : Playfair Display — serif éditorial, uppercase, letter-spacing serré
            Donne du caractère, du poids, de la noblesse
Data/tags : JetBrains Mono — signal de précision technique (même que HVAC)
Body      : Inter — même que HVAC, neutralité lisible
```

### Architecture des Sections
| Section | ID | Nom affiché | Angle |
|---------|-----|------------|-------|
| Hero | — | — | Spotlight cursor, titre monumentale, halo doré |
| Services | #craft | Our Craft | Chaque soin comme une pièce d'orfèvrerie |
| Galerie | #transformations | Transformations | Before/after scrubbed par scroll |
| Trust | #signature | Our Signature | Stats + certs + avis patients |
| Contact | #contact | Begin Your Journey | Booking premium, pas formulaire générique |

### Les 3 Moments "Wow" — Priorité absolue
1. **Hero spotlight cursor** : halo de lumière dorée suit le curseur sur la photo du sourire. Radial-gradient masqué + mix-blend-mode. Jamais vu sur un site dentaire.
2. **Transformation reveal scrubbed** : before/after contrôlé par le scroll via clipPath GSAP scrub:1. L'utilisateur *ressent* la transformation en scrollant.
3. **Gold precision overlay** : fines lignes dorées de mesure apparaissent progressivement sur les photos de sourires. Fiction esthétique qui signal l'expertise chirurgicale.

---

## Règles Techniques Critiques — Apprises en Production sur Projet HVAC

### ❌ Tailwind v4 — Pièges Mortels
```
JAMAIS d'opacity modifier sur CSS variables ou couleurs arbitraires :
  ❌  bg-[#0C0B09]/90   →  génère color-mix() → iOS Safari bug
  ❌  text-gold/50      →  color-mix() sur variable → rendu incohérent
  ❌  bg-primary/80     →  idem

✅  Toujours inline style :
    style={{ backgroundColor: "rgba(12,11,9,0.92)" }}
    style={{ color: "rgba(201,160,72,0.5)" }}

EXCEPTION : les couleurs statiques Tailwind fonctionnent :
  ✅  text-white/50    →  oklch(1 0 0 / 50%)  — OK
  ✅  border-black/20  →  OK
```

### ❌ GSAP — Patterns Interdits
```
JAMAIS gsap.from() → FOUC garanti (état initial posé après le premier paint SSR)
✅  Pattern obligatoire :
    gsap.set(".element", { opacity: 0, y: 30 });   // état initial
    gsap.to(".element", { opacity: 1, y: 0, ... }); // animation vers final

JAMAIS gsap.registerPlugin() au niveau module dans "use client" :
    ❌  gsap.registerPlugin(ScrollTrigger);  // module level = SSR crash
    ✅  Toujours à l'intérieur du callback useGSAP() ou useEffect()

JAMAIS module-level code avec browser APIs dans "use client" :
    → "use client" module code s'exécute côté serveur en Next.js SSR
    → window, document, navigator = inexistants en Node.js → crash build

JAMAIS ScrollTrigger.normalizeScroll(true) :
    → Supprime le scroll natif iOS → UX cassée sur mobile
```

### ✅ FOUC Prevention — Obligatoire
```css
/* Dans globals.css — rend les éléments animés invisibles dès le SSR HTML */
/* GSAP override via gsap.to() au bon moment */
.hero-badge, .hero-title, .hero-sub, .hero-cta {
  opacity: 0;
}
```
Sans ça : flash visible ~300ms sur premier chargement (bundle JS pas encore en cache).

### ✅ useGSAP vs useEffect
```
useGSAP = useLayoutEffect → s'exécute AVANT le premier paint du browser
         → Poser les états initiaux ici (gsap.set)

useEffect = s'exécute APRÈS le paint
          → Ne pas utiliser pour les états initiaux d'animation
          → OK pour les event listeners (mousemove, scroll, resize)
```

### ✅ ScrollTrigger Config — Toujours
```tsx
// Dans GSAPConfig.tsx, à l'intérieur de useEffect :
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
// ignoreMobileResize: true → évite les recalculs fantômes quand
// le chrome iOS apparaît/disparaît au scroll
```

### ✅ iOS — Pièges Connus
```
Fixed elements dans un parent z-indexed = trapped sur iOS
✅  Navbar positionné HORS du <main> dans le root stacking context

backdrop-filter avec Tailwind opacity modifiers = color-mix() → iOS bug
✅  Toujours inline style pour backdrop-filter + backgroundColor

Curseur custom :
✅  pointer: fine detection (pas pointer: coarse)
✅  cursor: none sur <html>, pas <body>
✅  Event delegation sur document pour hover (couvre éléments dynamiques React)
✅  requestAnimationFrame loop pour lerp du ring — cleanup dans return
```

### ✅ Scroll Padding — Navigation Anchors
```css
html { scroll-padding-top: 4.5rem; }   /* mobile — navbar shrunk = ~48px */
@media (min-width: 1024px) {
  html { scroll-padding-top: 5rem; }   /* desktop */
}
```

---

## Stack Technique
```
Next.js      16.2.4 (App Router, Turbopack)
React        19.2.4
TypeScript   strict mode
Tailwind CSS v4 (voir règles critiques)
GSAP         3.15 + @gsap/react 2.1
Lucide React icônes
next/font    Playfair Display + Inter + JetBrains Mono
Images       Unsplash (remotePatterns configuré)
```

---

## Architecture Fichiers
```
src/
├── app/
│   ├── globals.css          Design tokens + FOUC prevention
│   ├── layout.tsx           Fonts + metadata
│   └── page.tsx             Composition sections
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       Scroll-aware shrink + active section indicator
│   │   └── Footer.tsx
│   └── shared/
│       ├── GSAPConfig.tsx   registerPlugin + ignoreMobileResize
│       ├── CustomCursor.tsx Gold crosshair cursor
│       ├── AmbientCanvas.tsx Particules dorées flottantes
│       └── GlobalTexture.tsx Grain film
├── sections/
│   ├── HeroSection.tsx      Spotlight cursor + titre monumental
│   ├── CraftSection.tsx     "Our Craft" — services
│   ├── GallerySection.tsx   "Transformations" — before/after scrubbed
│   ├── TrustSection.tsx     "Our Signature" — stats + avis
│   └── ContactSection.tsx   "Begin Your Journey"
└── lib/
    └── constants.ts         CABINET, NAV_LINKS, STATS
```

---

## Référence Projet
Adapté de l'architecture HVAC-master-template-V2 (même dépôt parent).
Mêmes patterns GSAP, même structure Next.js, même discipline Tailwind v4.
Nouvelle DA : obsidien + or / Playfair Display / atelier luxe vs industriel thermique.
