# LightCycle UI — System Specification

## Purpose

This document defines a framework-agnostic UI lighting system driven by real system time.
An AI agent reading this file must be able to generate all required code without further clarification.

The system:

- reads real time via JavaScript
- exposes time and lighting as CSS Custom Properties
- renders all visuals using CSS only
- uses no images, no GIFs, no canvas
- is distributable as a Web Components library

JavaScript acts only as a **sensor**.
CSS is the **rendering engine**.

---

## Core Principles (Non-Negotiable)

1. Single Source of Truth

   - Time is normalized to a value between 0 and 1
   - 0.0 = midnight
   - 0.5 = noon
   - 1.0 wraps back to midnight
2. CSS-First Rendering

   - All visuals (sky, reflections, shadows, materials) are derived from CSS variables
   - JavaScript MUST NOT style elements directly
3. No Simulated Time

   - Real system time is required
   - Manual override is allowed but must be explicit
4. No Visual Assets

   - No images
   - No GIFs
   - No canvas / WebGL
   - Gradients, blend modes, backdrop-filter are allowed
5. Framework Agnostic

   - Must work in plain HTML
   - Must be usable inside React, Vue, Svelte, etc.

---

## Public CSS Contract (Critical)

These CSS variables are part of the public API and MUST be considered stable.

```
:root {
  /* Time /
  --lc-time-day: 0.0;           / 0 → 1 /
 / Light position (UI space) /
  --lc-light-x: 50%;
  --lc-light-y: 50%;
  / Light energy /
  --lc-light-intensity: 0.0;    / 0 → 1 /
  --lc-ambient-light: 0.0;      / 0 → 1 /
  / Light color /
  --lc-light-temperature: 6500; / Kelvin-like scalar */
}
```



These variables are set ONLY by `<light-controller>`.

---

## Time → Light Mapping Rules

From `--lc-time-day` the system MUST derive:

- azimuth (horizontal movement)
- elevation (height of sun/moon)
- intensity (day > night)
- temperature (warm at sunrise/sunset, cool at night)

Suggested mathematical model:

yyy
--elevation = sin(time * 1turn)
--intensity = clamp(0.1, elevation, 1)
yyy

---

## Components Overview

### `<light-controller>`

Role:

- Reads system time
- Updates CSS variables on `:root`

Attributes:

- mode="auto|manual" (default: auto)
- tick="1000" (milliseconds)

Public methods:

```
setTime(value: number) // normalized 0–1

```

Events:

```
lc:timechange { time: number }

```

Responsibilities:

- normalize time
- update at fixed tick
- never render UI
- never inject styles directly

---

### `<sky-layer>` (optional)

Role:

- Pure CSS sky visualization

Rules:

- consumes light variables
- contains no time logic
- must be replaceable

---

## UI Materials (Core Feature)

Materials are Web Components that react to light.

### `<glass-surface>`

Attributes:

- reflectivity="0–1" (default 0.35)
- roughness="0–1" (default 0.25)

Internal CSS variables:

```
--lc-material-reflectivity
--lc-material-roughness

```

Rendering rules:

- reflections via radial-gradient
- reflection direction follows --lc-light-x / --lc-light-y
- intensity scales with --lc-light-intensity
- mix-blend-mode: screen
- backdrop-filter allowed with fallback

---

## Lighting → UI Mapping

Reflections:

- follow light direction
- warmer during day
- cooler at night

Shadows:

- opposite direction of light
- blur increases at low elevation
- opacity decreases with ambient light

Text:

- must remain readable
- contrast must increase at night

---

## Accessibility (Mandatory)

The system MUST respect:

- prefers-reduced-motion
- prefers-color-scheme

Motion MUST be reducible to zero.

---

## Progressive Enhancement

If backdrop-filter is unsupported:

- fall back to opaque backgrounds
- maintain contrast and readability

No feature should fully break without modern APIs.

---

## Distribution Requirements

- ES modules
- No runtime dependencies
- Side-effect free imports
- Tree-shakeable
- Publishable to npm

Suggested usage:

```
import '@lightcycle/ui';
```

---

## Explicitly Forbidden

- CSS-in-JS
- Inline style mutation
- Canvas / WebGL
- Framework-specific APIs
- Hardcoded colors unrelated to light variables

---

## Project Goal Summary

This system demonstrates:

- CSS as a rendering language
- separation of concerns (time vs visuals)
- design-system thinking applied to light
- real-time UI driven by environmental data

Implementation must favor clarity, extensibility, and correctness over visual gimmicks.
