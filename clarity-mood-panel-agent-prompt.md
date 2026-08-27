# Agent Prompt — Build the Clarity Mood Selection Panel

Paste everything below into Gemini Pro 3.1 (Antigravity agent mode). It is written as a direct instruction to the agent, with the exact visual spec reverse-engineered frame-by-frame from the reference video.

---

## ROLE

You are a senior frontend engineer working inside the existing **Clarity** repository (`github.com/THE-DEDUCTER/Clarity`). Stack already in place: **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui**, with `components.json` already configured. Do not scaffold a new project — extend the existing one. Install `framer-motion` if it isn't already a dependency; it's required for the physics/morph animations below.

## GOAL

Recreate a two-step "Mood Meter" style mood check-in panel, matching the reference 1:1: a 2×2 color-quadrant picker, then a pannable honeycomb grid of emotion words within that quadrant, then a bottom confirmation sheet. This is the well-known four-quadrant affect grid pattern (energy × pleasantness), not a proprietary layout — implement it as original code.

---

## SCREEN 1 — Quadrant Picker

**Route/Component:** `MoodQuadrantPicker.tsx`

- Full-bleed pure black background (`#000000`), safe-area padding top/bottom.
- Header row: circular `40px` dark-gray (`#1A1A1A`) icon buttons — close/back (X or ←) top-left, search icon top-right. Icons white, centered, subtle 1px lighter border for depth.
- Title, centered, ~48px below header: two lines, serif font (Georgia/Times New Roman weight ~500, NOT italic), white, ~22px, line-height tight, centered:
  - "Tap the color that best describes"
  - "how you feel right now"
- Below the title, a **2×2 grid of large circles** (not squares), each roughly 46% of screen width, touching/slightly overlapping at the seam so the four circles read as one continuous soft cluster:
  - Top-left: **High Energy Unpleasant** — red/coral gradient (`#FF4B5C` → `#FF3355`, radial, lighter highlight top-left)
  - Top-right: **High Energy Pleasant** — golden-yellow gradient (`#FFD84D` → `#FFB020`)
  - Bottom-left: **Low Energy Unpleasant** — sky-blue gradient (`#5EB3FF` → `#3B82F6`)
  - Bottom-right: **Low Energy Pleasant** — mint/teal gradient (`#4ADE9E` → `#10B981`)
- Each circle has a soft outer glow matching its own color at low opacity, and a faint darker rim/stroke around the edge (looks like layered circles, ~4px offset shadow behind each in a slightly darker shade of the same hue).
- Label inside each circle: two lines, bold sans-serif, black text, centered, e.g. "High Energy / Unpleasant".
- Tapping a quadrant animates a zoom-transition (scale + fade, ~350ms ease) into Screen 2, pre-scrolled to that quadrant's region of the grid.

---

## SCREEN 2 — Emotion Honeycomb Grid

**Route/Component:** `MoodGrid.tsx` + `MoodBubble.tsx`

### Layout mechanics
- This is conceptually **one continuous master grid of ~100 emotion words**, arranged in rows, colored in four smooth-blending quadrants (red↔yellow across the top, blue↔green across the bottom, red↔blue down the left, yellow↔green down the right — i.e., the classic circumplex/mood-meter layout). Screen 1 just deep-links/scrolls into a starting region of this same grid; do not build four separate disconnected grids.
- Rows are **offset like brick/hex packing**: each row shifted horizontally by half a bubble-width from the row above, so bubbles nestle into the gaps of the row above/below.
- Bubbles **touch and slightly overlap** their neighbors — no visible grid gutters, this should read as a packed cluster, not a CSS grid with gaps.
- Roughly 3 full bubbles are visible per row on a ~390–430px mobile viewport; bubbles at the left/right screen edge are cropped (bleed off-screen), signaling horizontal pan is available. Support both vertical scroll (primary) and horizontal pan/drag.
- Bubble diameter varies by "salience": the word(s) meant to anchor each cluster (e.g. "Angry", "Anxious", "Sympathetic", "Relaxed") render notably larger (~190–210px) with larger bold text; ordinary neighboring bubbles are ~150–165px; peripheral ones taper down to ~130px. This creates a visual center of gravity per emotion family without a hard grid.
- Color: every bubble is tinted per its quadrant family, with a **gradient from more saturated/intense (deeper into that emotion's cluster) to a lighter, softer tint** (near the quadrant boundary blending toward the adjacent quadrant's hue). Use the 4 base gradients from Screen 1 as the palette anchors.
- Bubble text: bold, sans-serif, black (`#0A0A0A`), centered, sized proportionally to bubble diameter (roughly 15–17% of diameter), auto-shrinks to fit two words like "At Ease".
- Header persists: back arrow top-left, search icon top-right, plus a small pill/flag glyph centered (bookmark-style icon) — keep consistent with Screen 1's header chrome.

### Selection state (tap a bubble)
- The tapped bubble becomes the **focal bubble**: it grows ~15–20% larger than its resting size and its silhouette morphs from a plain circle into an **organic notched/scalloped blob** — implement as an SVG `clip-path` (or `path`) with 6–8 control points offset by a small pseudo-random radius (seeded per mood id, so it's stable, not re-randomized every render), animated in with a spring (`framer-motion`, stiffness ~300, damping ~20). This reads as either a soft 4-petal scallop or a jagged 4-point star depending on the seed — both variants are valid, pick one consistent algorithm and let the seed vary the silhouette.
- Add a subtle outer glow in the bubble's own color behind the morphed shape.
- Neighboring bubbles do NOT resize — only the selected one grows/morphs.
- Text stays centered and legible through the morph (increase font-weight slightly if needed).

### Bottom confirmation sheet (appears on selection)
- Slides up from bottom, dark charcoal background (`#1C1C1E`, ~92% opacity, blurred), rounded top corners (~24px), fixed to bottom of viewport, overlapping the bottom row of bubbles.
- Left-aligned two-line text block:
  - Line 1: the mood word, bold, colored in the bubble's own hue (e.g. red text for "Irate", teal text for "Sympathetic").
  - Line 2: a short one-sentence definition in white/light-gray, ~15px, up to 2 lines wrap (e.g. "Feeling like your anger is almost out of control").
- Right side: a circular solid-white button (~56px) with a black right-arrow icon, confirms selection and advances the flow.
- Sheet height ~110–130px, safe-area bottom padding included.

---

## DATA MODEL

Create `lib/mood-data.ts` exporting a typed list. Structure (fill in full ~100-word set across all four quadrants using standard affect/mood-meter vocabulary — energy × pleasantness taxonomy; below is the exact word set confirmed from the reference for two quadrants, extend the other two consistently):

```ts
export type Quadrant = "high-unpleasant" | "high-pleasant" | "low-unpleasant" | "low-pleasant";

export interface MoodWord {
  id: string;
  label: string;
  quadrant: Quadrant;
  intensity: number; // 1-5, 5 = most intense/central, drives bubble size
  description: string;
}
```

**High Energy / Unpleasant (red)** — confirmed set: Enraged, Terrified, Panicked, Shocked, Livid, Irate, Overwhelmed, Furious, Frightened, Anxious, Apprehensive, Jealous, Angry (anchor), Scared, Jittery, Repulsed, Frustrated, Embarrassed, Contempt, Troubled, Nervous, Worried, Disgusted, Trapped, Disheartened, Insecure, Humiliated, Tense, Uneasy, Peeved, Concerned.

**Low Energy / Pleasant (green/teal)** — confirmed set: Calm, At Ease, Understood, Good, Thoughtful, Appreciated, Relaxed, Chill, Compassionate, Sympathetic (anchor), Comfortable, Peaceful, Mellow, Balanced, Tranquil, Carefree, Thankful, Empathetic.

**Low Energy / Unpleasant (blue)** — confirmed set: Down, Bored, Meh, Tired, Fatigued, Disengaged, Apathetic, Sad, Lonely, Discouraged, Exhausted, Helpless.

**High Energy / Pleasant (yellow)** — confirmed set: Pleasant, Focused, Pleased, Playful, Curious, Upbeat (extend with additional standard high-energy-pleasant words like Excited, Energized, Optimistic, Motivated, Inspired, Confident, Proud, Amazed to fill the grid density seen in the reference).

Each word needs a short RULER-style one-line definition for the bottom sheet (write plain, non-clinical definitions, 8–14 words each).

---

## INTERACTION / MOTION SPEC

- Use `framer-motion` `layoutId` transitions for the Screen 1 → Screen 2 zoom.
- Grid scroll: native scroll container with momentum; consider `framer-motion`'s `useScroll` only if you need parallax on bubble scale — not required for v1.
- Bubble tap: scale-spring in place, morph clip-path, then bottom sheet slides in (`y: 100% → 0`, spring, ~300ms).
- Deselecting/tapping a different bubble: previous bubble springs back to plain circle at resting size before/while the new one morphs.
- Respect `prefers-reduced-motion`: fall back to simple opacity/scale fades, skip the clip-path morph (just scale up 10%).

---

## COMPONENT / FILE STRUCTURE

```
src/
  components/mood/
    MoodQuadrantPicker.tsx
    MoodGrid.tsx
    MoodBubble.tsx
    MoodConfirmSheet.tsx
  lib/
    mood-data.ts
  app/
    check-in/
      page.tsx        // hosts the flow, local state: 'quadrant' | 'grid'
```

Use existing shadcn primitives where they fit (`Sheet` or `Drawer` for the bottom confirmation panel, `Button` for the arrow button) rather than hand-rolling — check `components.json` for what's already installed before adding new shadcn components.

---

## ACCEPTANCE CHECKLIST

- [ ] Pure black background throughout, no visible screen edges/margins on the grid (bubbles bleed off-screen left/right)
- [ ] Quadrant picker: 4 circles, correct gradient direction and hues, serif two-line title, header icons match
- [ ] Grid: brick-offset packing, bubbles touching/overlapping, size varies by `intensity`, colors blend smoothly across the master grid rather than hard-cutting at quadrant boundaries
- [ ] Selected bubble grows + morphs into a non-circular organic shape via spring animation
- [ ] Bottom sheet: colored mood name + description + white circular arrow button, slides up smoothly
- [ ] Fully responsive down to 360px width, safe-area aware for iOS notch/home-indicator
- [ ] `prefers-reduced-motion` respected
- [ ] TypeScript strict, no `any`, matches existing repo lint/format config (`eslint.config.mjs`)
