# DESIGN.md -- Xplorem

<!-- extraction-meta
source: Figma file "Xplorem"
scope: 1 page(s)
date: 2026-09-06
nodes-scanned: 3469
generator: figma-cli extract
-->

> **Structure trees auto-split** (~67k tokens — too large for one AI context): per-page trees are in `DESIGN-structure/`. Use `--no-split` to force a single file.

## 1. Identity

**In one line:** A design system using JetBrains Mono, Hanken Grotesk, Sora, Inter with 32 unique colors extracted directly from Figma.

**Signature Techniques:**
- Consistent auto-layout spacing system
- Component library with 0 variants across 0 component sets

## 2. Color

### Palette

| Token | Hex | Usage count |
|---|---|---|
| border | `#c0c7d5` | 409 |
| accent | `#a3c9ff` | 282 |
| accent-alt | `#1c365d` | 246 |
| accent-3 | `#dde2f1` | 167 |
| background | `#ffffff` | 113 |
| accent-4 | `#161c26` | 77 |
| accent-5 | `#00315c` | 46 |
| text-primary | `#1a202a` | 42 |
| text-primary-alt | `#2f3540` | 36 |
| accent-6 | `#3399ff` | 28 |
| accent-7 | `#0e131e` | 26 |
| accent-8 | `#87beef` | 22 |
| text-tertiary | `#8a919e` | 19 |
| accent-9 | `#facc15` | 18 |
| accent-10 | `#004d78` | 17 |
| accent-11 | `#ffb4ab` | 16 |
| accent-12 | `#00305a` | 14 |
| accent-13 | `#0a1525` | 14 |
| text-primary-3 | `#242a35` | 13 |
| text-primary-4 | `#050a14` | 11 |
| text-primary-5 | `#000000` | 11 |
| accent-14 | `#95ccfe` | 10 |
| text-primary-6 | `#080e18` | 8 |
| text-tertiary-alt | `#6b7280` | 7 |
| text-secondary | `#404753` | 5 |
| accent-15 | `#9acbff` | 3 |
| accent-16 | `#4285f4` | 1 |
| accent-17 | `#34a853` | 1 |
| accent-18 | `#fbbc05` | 1 |
| accent-19 | `#ea4335` | 1 |
| accent-20 | `#5d9bd7` | 1 |
| accent-21 | `#93000a` | 1 |

## 3. Variables

_no local variables found — this file has no variable collections, the palette above is sampled from raw fills_

## 4. Typography

### Fonts

- JetBrains Mono
- Hanken Grotesk
- Sora
- Inter

### Scale

| Token | Family | Size | Weight | Line height |
|---|---|---|---|---|
| display | Sora | 240px | 700 | 240px |
| display-2 | Sora | 160px | 700 | 160px |
| display-3 | Sora | 64px | 800 | 80px |
| display-4 | Sora | 48px | 700 | 56px |
| display-5 | Sora | 48px | 700 | 60px |
| display-6 | Inter | 39px | 700 | auto |
| h1 | Sora | 32px | 600 | 40px |
| h2 | Sora | 24px | 700 | 32px |
| h2-2 | Sora | 24px | 700 | 32px |
| h2-3 | Sora | 24px | 400 | 32px |
| h2-4 | Hanken Grotesk | 24px | 400 | 24px |
| h2-5 | Sora | 24px | 400 | 30px |
| h2-6 | Sora | 24px | 400 | 24px |
| h3 | Sora | 20px | 400 | auto |
| h4 | Sora | 18px | 400 | 24px |
| h4-2 | Hanken Grotesk | 18px | 400 | 28px |
| h4-3 | Hanken Grotesk | 18px | 400 | 29.25px |
| h4-4 | Sora | 18px | 700 | 22.5px |
| body-lg | Hanken Grotesk | 16px | 400 | 24px |
| body-lg-2 | JetBrains Mono | 16px | 400 | 24px |
| body-lg-3 | Hanken Grotesk | 16px | 500 | 24px |
| body-lg-4 | JetBrains Mono | 16px | 500 | 24px |
| body-lg-5 | Hanken Grotesk | 16px | 400 | auto |
| body-lg-6 | Hanken Grotesk | 16px | 600 | 24px |
| body-lg-7 | Sora | 16px | 700 | 24px |
| body | JetBrains Mono | 14px | 500 | 20px |
| body-2 | Hanken Grotesk | 14px | 400 | 20px |
| body-3 | Hanken Grotesk | 14px | 400 | 20px |
| body-4 | Hanken Grotesk | 14px | 600 | 20px |
| body-5 | JetBrains Mono | 14px | 400 | 20px |
| body-6 | Hanken Grotesk | 14px | 500 | 20px |
| body-7 | JetBrains Mono | 14px | 500 | auto |
| body-8 | Hanken Grotesk | 14px | 400 | auto |
| body-9 | JetBrains Mono | 14px | 500 | 20px |
| body-10 | Hanken Grotesk | 14px | 400 | 17.5px |
| body-11 | Sora | 14px | 700 | 17.5px |
| body-12 | Sora | 14px | 400 | auto |
| body-13 | JetBrains Mono | 14px | 500 | 20px |
| caption | Hanken Grotesk | 12px | 400 | 16px |
| caption-2 | JetBrains Mono | 12px | 400 | 16px |
| caption-3 | Hanken Grotesk | 12px | 400 | 16px |
| caption-4 | JetBrains Mono | 12px | 400 | 16px |
| caption-5 | JetBrains Mono | 12px | 400 | 16px |
| caption-6 | Hanken Grotesk | 12px | 400 | 19.5px |
| caption-7 | JetBrains Mono | 12px | 400 | 16px |
| caption-8 | Hanken Grotesk | 10px | 400 | 24px |
| caption-9 | JetBrains Mono | 10px | 400 | 24px |
| caption-10 | JetBrains Mono | 10px | 500 | 24px |
| caption-11 | JetBrains Mono | 10px | 400 | 24px |
| caption-12 | JetBrains Mono | 10px | 400 | 24px |
| caption-13 | JetBrains Mono | 10px | 500 | 20px |

## 5. Spacing & Layout

### Base Unit

2px

### Border Radius

| Token | Value |
|---|---|
| radius-sm | 4px |
| radius-md | 6px |
| radius-lg | 8px |
| radius-lg-2 | 12px |
| radius-lg-3 | 16px |
| radius-lg-4 | 24px |
| radius-full | 9999px |

## 6. Depth & Motion

### Elevation

- BACKGROUND_BLUR blur 12px (used 51×)
- 0px 4px 6px -4px #000000 @ 10% (used 28×)
- 0px 10px 15px -3px #000000 @ 10% (used 28×)
- BACKGROUND_BLUR blur 16px (used 16×)
- BACKGROUND_BLUR blur 24px (used 13×)
- 0px 1px 2px 0px #000000 @ 5% (used 12×)
- 0px 4px 6px -4px #a3c9ff @ 20% (used 7×)
- 0px 10px 15px -3px #a3c9ff @ 20% (used 7×)
- BACKGROUND_BLUR blur 4px (used 6×)
- 0px 25px 50px -12px #000000 @ 25% (used 5×)
- 0px 0px 10px 0px #a3c9ff @ 80% (used 3×)
- LAYER_BLUR blur 120px (used 3×)
- 0px 0px 15px 0px #3399ff @ 30% (used 3×)
- 0px 0px 50px 0px #a3c9ff @ 30% (used 3×)
- 0px 0px 15px 0px #3399ff @ 50% (used 3×)
- 0px 2px 4px -2px #000000 @ 10% (used 3×)
- 0px 4px 6px -1px #000000 @ 10% (used 3×)
- LAYER_BLUR blur 100px (used 2×)
- 0px 0px 20px 0px #3399ff @ 40% (used 2×)
- 0px 8px 32px 0px #000000 @ 80% (used 2×)
- 0px 0px 8px 0px #3399ff @ 100% (used 2×)
- LAYER_BLUR blur 150px (used 1×)
- BACKGROUND_BLUR blur 20px (used 1×)
- inset 0px 0px 0px 2px #a3c9ff @ 5% (used 1×)
- 0px 0px 8px 0px #a3c9ff @ 60% (used 1×)
- 0px 0px 20px 0px #3399ff @ 30% (used 1×)
- 0px 0px 30px 0px #a3c9ff @ 20% (used 1×)
- LAYER_BLUR blur 80px (used 1×)
- 0px 0px 8px 0px #95ccfe @ 100% (used 1×)
- 0px 0px 8px 0px #9acbff @ 100% (used 1×)
- inset 0px 2px 4px 0px #000000 @ 5% (used 1×)
- 0px 0px 15px 0px #3399ff @ 40% (used 1×)
- 0px 1px 2px 0px #a3c9ff @ 20% (used 1×)
- 0px 0px 20px 0px #a3c9ff @ 30% (used 1×)
- 0px 0px 30px 0px #a3c9ff @ 40% (used 1×)

## 7. Components

_no component sets found_

## 8. States

State tokens should be derived from the base palette above. Recommended mappings:

| State | Treatment |
|-------|-----------|
| Hover | Lighten/darken accent by 10% |
| Focus | 2px ring using accent color with 30% opacity |
| Disabled | 40% opacity, no pointer events |
| Error | Use danger color for border and text |

## 9. Rules

### Do

- Use the 2px base unit for all spacing decisions
- Use `#a3c9ff` (accent) as the primary accent color
- Bind colors to the tokens below instead of hardcoding hex values

### Don't

- Introduce new colors without adding them to the palette
- Mix corner radii outside the radius scale

## 10. Extending this system

### How to reuse this DESIGN.md

Import into Figma with `figma-cli import <this file>` — colors, radii and typography become variables.

### When to add a new token vs reuse

Reuse the closest existing token; add a new one only when a new semantic role appears.

## 11. Machine-readable tokens

The block below is the canonical token map. It mirrors the tables above but is unambiguous and parseable.

```json design-tokens
{
  "$schema": "design-tokens.v1",
  "meta": {
    "source": "Xplorem",
    "generated": "2026-09-06"
  },
  "color": {
    "border": "#c0c7d5",
    "accent": "#a3c9ff",
    "accent-alt": "#1c365d",
    "accent-3": "#dde2f1",
    "background": "#ffffff",
    "accent-4": "#161c26",
    "accent-5": "#00315c",
    "text-primary": "#1a202a",
    "text-primary-alt": "#2f3540",
    "accent-6": "#3399ff",
    "accent-7": "#0e131e",
    "accent-8": "#87beef",
    "text-tertiary": "#8a919e",
    "accent-9": "#facc15",
    "accent-10": "#004d78",
    "accent-11": "#ffb4ab",
    "accent-12": "#00305a",
    "accent-13": "#0a1525",
    "text-primary-3": "#242a35",
    "text-primary-4": "#050a14",
    "text-primary-5": "#000000",
    "accent-14": "#95ccfe",
    "text-primary-6": "#080e18",
    "text-tertiary-alt": "#6b7280",
    "text-secondary": "#404753",
    "accent-15": "#9acbff",
    "accent-16": "#4285f4",
    "accent-17": "#34a853",
    "accent-18": "#fbbc05",
    "accent-19": "#ea4335",
    "accent-20": "#5d9bd7",
    "accent-21": "#93000a"
  },
  "typography": {
    "display": {
      "fontFamily": "Sora",
      "fontSize": 240,
      "fontWeight": 700,
      "lineHeight": 240
    },
    "display-2": {
      "fontFamily": "Sora",
      "fontSize": 160,
      "fontWeight": 700,
      "lineHeight": 160
    },
    "display-3": {
      "fontFamily": "Sora",
      "fontSize": 64,
      "fontWeight": 800,
      "lineHeight": 80,
      "letterSpacing": -3.200000047683716
    },
    "display-4": {
      "fontFamily": "Sora",
      "fontSize": 48,
      "fontWeight": 700,
      "lineHeight": 56,
      "letterSpacing": -0.9599999785423279
    },
    "display-5": {
      "fontFamily": "Sora",
      "fontSize": 48,
      "fontWeight": 700,
      "lineHeight": 60,
      "letterSpacing": -0.9599999785423279
    },
    "display-6": {
      "fontFamily": "Inter",
      "fontSize": 39,
      "fontWeight": 700,
      "letterSpacing": -0.9750000238418579
    },
    "h1": {
      "fontFamily": "Sora",
      "fontSize": 32,
      "fontWeight": 600,
      "lineHeight": 40
    },
    "h2": {
      "fontFamily": "Sora",
      "fontSize": 24,
      "fontWeight": 700,
      "lineHeight": 32,
      "letterSpacing": -0.6000000238418579
    },
    "h2-2": {
      "fontFamily": "Sora",
      "fontSize": 24,
      "fontWeight": 700,
      "lineHeight": 32
    },
    "h2-3": {
      "fontFamily": "Sora",
      "fontSize": 24,
      "fontWeight": 400,
      "lineHeight": 32
    },
    "h2-4": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 24,
      "fontWeight": 400,
      "lineHeight": 24
    },
    "h2-5": {
      "fontFamily": "Sora",
      "fontSize": 24,
      "fontWeight": 400,
      "lineHeight": 30
    },
    "h2-6": {
      "fontFamily": "Sora",
      "fontSize": 24,
      "fontWeight": 400,
      "lineHeight": 24
    },
    "h3": {
      "fontFamily": "Sora",
      "fontSize": 20,
      "fontWeight": 400
    },
    "h4": {
      "fontFamily": "Sora",
      "fontSize": 18,
      "fontWeight": 400,
      "lineHeight": 24
    },
    "h4-2": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 18,
      "fontWeight": 400,
      "lineHeight": 28
    },
    "h4-3": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 18,
      "fontWeight": 400,
      "lineHeight": 29.25
    },
    "h4-4": {
      "fontFamily": "Sora",
      "fontSize": 18,
      "fontWeight": 700,
      "lineHeight": 22.5,
      "letterSpacing": 0.699999988079071
    },
    "body-lg": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 16,
      "fontWeight": 400,
      "lineHeight": 24
    },
    "body-lg-2": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 16,
      "fontWeight": 400,
      "lineHeight": 24
    },
    "body-lg-3": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 16,
      "fontWeight": 500,
      "lineHeight": 24
    },
    "body-lg-4": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 16,
      "fontWeight": 500,
      "lineHeight": 24
    },
    "body-lg-5": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 16,
      "fontWeight": 400
    },
    "body-lg-6": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 16,
      "fontWeight": 600,
      "lineHeight": 24
    },
    "body-lg-7": {
      "fontFamily": "Sora",
      "fontSize": 16,
      "fontWeight": 700,
      "lineHeight": 24,
      "letterSpacing": -0.4000000059604645
    },
    "body": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 14,
      "fontWeight": 500,
      "lineHeight": 20,
      "letterSpacing": 0.699999988079071
    },
    "body-2": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 14,
      "fontWeight": 400,
      "lineHeight": 20,
      "letterSpacing": 0.699999988079071
    },
    "body-3": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 14,
      "fontWeight": 400,
      "lineHeight": 20
    },
    "body-4": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 14,
      "fontWeight": 600,
      "lineHeight": 20,
      "letterSpacing": 0.699999988079071
    },
    "body-5": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 14,
      "fontWeight": 400,
      "lineHeight": 20
    },
    "body-6": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 14,
      "fontWeight": 500,
      "lineHeight": 20,
      "letterSpacing": 0.699999988079071
    },
    "body-7": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 14,
      "fontWeight": 500,
      "letterSpacing": 0.699999988079071
    },
    "body-8": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 14,
      "fontWeight": 400
    },
    "body-9": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 14,
      "fontWeight": 500,
      "lineHeight": 20,
      "letterSpacing": 1.399999976158142
    },
    "body-10": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 14,
      "fontWeight": 400,
      "lineHeight": 17.5
    },
    "body-11": {
      "fontFamily": "Sora",
      "fontSize": 14,
      "fontWeight": 700,
      "lineHeight": 17.5
    },
    "body-12": {
      "fontFamily": "Sora",
      "fontSize": 14,
      "fontWeight": 400,
      "letterSpacing": 0.699999988079071
    },
    "body-13": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 14,
      "fontWeight": 500,
      "lineHeight": 20,
      "letterSpacing": 2.799999952316284
    },
    "caption": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": 16
    },
    "caption-2": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": 16,
      "letterSpacing": 0.6000000238418579
    },
    "caption-3": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": 16,
      "letterSpacing": 0.6000000238418579
    },
    "caption-4": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": 16
    },
    "caption-5": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": 16,
      "letterSpacing": 1.2000000476837158
    },
    "caption-6": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": 19.5
    },
    "caption-7": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": 16,
      "letterSpacing": 0.6000000238418579
    },
    "caption-8": {
      "fontFamily": "Hanken Grotesk",
      "fontSize": 10,
      "fontWeight": 400,
      "lineHeight": 24
    },
    "caption-9": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 10,
      "fontWeight": 400,
      "lineHeight": 24,
      "letterSpacing": 1
    },
    "caption-10": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 10,
      "fontWeight": 500,
      "lineHeight": 24
    },
    "caption-11": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 10,
      "fontWeight": 400,
      "lineHeight": 24,
      "letterSpacing": 2
    },
    "caption-12": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 10,
      "fontWeight": 400,
      "lineHeight": 24
    },
    "caption-13": {
      "fontFamily": "JetBrains Mono",
      "fontSize": 10,
      "fontWeight": 500,
      "lineHeight": 20,
      "letterSpacing": 1
    }
  },
  "spacing": {
    "base-unit": 2
  },
  "radius": {
    "radius-sm": "4px",
    "radius-md": "6px",
    "radius-lg": "8px",
    "radius-lg-2": "12px",
    "radius-lg-3": "16px",
    "radius-lg-4": "24px",
    "radius-full": "9999px"
  },
  "shadow": {
    "shadow-1": "0px 4px 6px -4px #0000001a",
    "shadow-2": "0px 10px 15px -3px #0000001a",
    "shadow-3": "0px 1px 2px 0px #0000000d",
    "shadow-4": "0px 4px 6px -4px #a3c9ff33",
    "shadow-5": "0px 10px 15px -3px #a3c9ff33",
    "shadow-6": "0px 25px 50px -12px #00000040",
    "shadow-7": "0px 0px 10px 0px #a3c9ffcc",
    "shadow-8": "0px 0px 15px 0px #3399ff4d",
    "shadow-9": "0px 0px 50px 0px #a3c9ff4d",
    "shadow-10": "0px 0px 15px 0px #3399ff80",
    "shadow-11": "0px 2px 4px -2px #0000001a",
    "shadow-12": "0px 4px 6px -1px #0000001a",
    "shadow-13": "0px 0px 20px 0px #3399ff66",
    "shadow-14": "0px 8px 32px 0px #000000cc",
    "shadow-15": "0px 0px 8px 0px #3399ff",
    "shadow-16": "inset 0px 0px 0px 2px #a3c9ff0d",
    "shadow-17": "0px 0px 8px 0px #a3c9ff99",
    "shadow-18": "0px 0px 20px 0px #3399ff4d",
    "shadow-19": "0px 0px 30px 0px #a3c9ff33",
    "shadow-20": "0px 0px 8px 0px #95ccfe",
    "shadow-21": "0px 0px 8px 0px #9acbff",
    "shadow-22": "inset 0px 2px 4px 0px #0000000d",
    "shadow-23": "0px 0px 15px 0px #3399ff66",
    "shadow-24": "0px 1px 2px 0px #a3c9ff33",
    "shadow-25": "0px 0px 20px 0px #a3c9ff4d",
    "shadow-26": "0px 0px 30px 0px #a3c9ff66"
  },
  "fonts": [
    "JetBrains Mono",
    "Hanken Grotesk",
    "Sora",
    "Inter"
  ]
}
```
