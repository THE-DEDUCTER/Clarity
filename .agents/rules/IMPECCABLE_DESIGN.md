---
description: Impeccable UI Design System and Frontend Coding Guidelines
trigger: always_on
---

# Impeccable UI Design Guidelines

As an AI agent, you must follow these "Impeccable" UI design principles whenever creating or modifying front-end code (React, Next.js, Tailwind CSS). Do NOT output generic "AI-slop" designs.

## 1. Visual Hierarchy & Rhythm
- **Spacing:** Use generous, consistent whitespace. Follow a strict 4pt/8pt grid.
- **Typography:** Limit font weights. Use text size strategically to establish clear hierarchy (e.g., text-xs for metadata, text-sm for secondary text, text-base for body, text-2xl/3xl for headings).
- **Color Usage:** Avoid throwing primary colors everywhere. Use a predominantly neutral palette and reserve vibrant colors strictly for primary actions, active states, and focus rings.

## 2. Component Polish
- **Borders & Shadows:** Use subtle borders (border-border/50) and soft shadows (shadow-sm, shadow-md) instead of harsh drop shadows.
- **Corner Radii:** Be consistent. Avoid mixing disparate border radii indiscriminately.
- **Interactions:** Every interactive element must have a hover, focus, and active state. Use transition-all duration-300 for smooth micro-interactions (e.g., hover:bg-accent/50, active:scale-[0.98]).

## 3. Anti-Patterns to Avoid
- **NO over-use of gradients:** Do not use full-background gradients on every card.
- **NO excessive emojis:** Use professional SVG icons (Lucide React) instead of raw emojis unless explicitly requested.
- **NO cluttered cards:** Give card content room to breathe (p-6 or p-8).

## 4. Shared Vocabulary Commands
When the user uses these keywords, apply the specific transformations:
- **/polish**: Refine padding, adjust contrast, fix alignment, and add smooth hover states.
- **/bolder**: Increase contrast, enlarge primary typography, and make primary buttons pop more.
- **/quieter**: Reduce border opacity, soften text colors, and remove unnecessary backgrounds.
- **/critique**: Audit the current UI component against these impeccable standards.
