# Chicago Death Tour — Redesign Plan

## Guiding Principle

One continuous experience. The map isn't a mode — it's a compass. The flag isn't decoration — it's the visual throughline. The story of death→reform is always moving forward, whether you're on your couch or on Michigan Ave.

---

## Architecture: The Unified Scroll

### How It Works

The entire experience is a **single vertical scroll**. The map lives in a **persistent sidebar/strip** (desktop) or **sticky mini-map header** (mobile) that tracks your progress through the narrative. There is no mode toggle. Instead:

- **Reading at home**: You scroll the narrative. The map quietly follows along — panning to each location, drawing the route as you progress, showing where each event happened. It's ambient context, not demanding attention.
- **Walking in person**: You tap "I'm here" (GPS). The map expands, the narrative compresses into a companion panel, and stops reorder by proximity. Same content, different layout priority. A CSS/JS layout shift, not a page change.

### Layout

**Desktop (>900px)**:
```
┌─────────────────────────────────────────────────┐
│  [flag stars]  CHICAGO DEATH TOUR    [I'm Here] │
├────────────────────────────┬────────────────────┤
│                            │                    │
│   Narrative scroll         │   Sticky map       │
│   (60% width)              │   (40% width)      │
│                            │   Route draws as   │
│   Chapter content,         │   you scroll.      │
│   images, quotes,          │   Active stop      │
│   stats...                 │   highlighted.     │
│                            │   Flag progress    │
│                            │   indicator below  │
│                            │   map.             │
│                            │                    │
└────────────────────────────┴────────────────────┘
```

**Mobile (<900px)**:
```
┌──────────────────────┐
│ [stars] DEATH TOUR ☰ │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │  Mini-map strip   │ │  ← ~120px tall, sticky
│ │  (route + dot)    │ │     shows current location
│ └──────────────────┘ │
│                      │
│  Narrative scroll    │
│  Full-width content  │
│                      │
│  Chapters, images,   │
│  quotes, stats...    │
│                      │
└──────────────────────┘
```

**Walking Mode** (activated by GPS/"I'm Here"):
```
┌──────────────────────┐
│ [stars] WALKING  [✕] │
├──────────────────────┤
│                      │
│   Map (expanded,     │
│   ~60% viewport)     │
│   Your location +    │
│   nearest stop       │
│                      │
├──────────────────────┤
│  Narrative panel     │
│  (scrollable, 40%)   │
│  Current stop story  │
│  ← swipe for next →  │
└──────────────────────┘
```

---

## The Flag as Visual Throughline

The Chicago flag has **4 red stars**, each historically representing a defining event. Our tour has ~8 reforms. The flag concept works as:

1. **Header element**: The four stars (or a stylized version with more stars) appear in the persistent header. As you scroll past each reform, a star **fills in / lights up**. By the end, all stars are illuminated.

2. **Color language**: The blue stripes and red stars define the palette. The blue = water/geography/setting. The red = fire/blood/death/urgency. White = the space between — the reform, the rebuilding.

3. **Progress bar replacement**: Instead of a generic red progress bar, the flag elements themselves indicate progress. The two blue stripes could represent start and finish, with stars accumulating between them.

4. **Opening and closing bookend**: The tour opens with the flag deconstructed/dim. It closes with the flag fully assembled and bright — "this is what was built."

---

## Stop Restructuring

### Current Issues
- Stop 1 (Welcome) and Stop 10 (Century of Progress) are bookends with no deaths/reforms — they break the rhythm
- Stop 4 (Business, Labor & Blimp) mashes together 3 separate events spanning 54 years
- Chronological order means you zigzag across the city (bad for walking)

### Proposed Structure

**For the scroll/reading experience**: Keep chronological order — it serves the historical narrative arc.

**For walking mode**: Reorder by geographic proximity (calculate optimal walking route from the coordinates). The content is the same; the *sequence* adapts.

**Stop refinements**:
- Merge Welcome into the hero/landing section (not a numbered stop)
- Merge Century of Progress into the closing section (not a numbered stop)
- Consider splitting "Business, Labor & Blimp" into distinct stops if locations differ
- This gives us **8 core stops** (or more if we split), each with real weight

Result: Every numbered stop has death, consequence, and place. No filler.

---

## Scroll-Driven Map Behavior

As the user scrolls through chapters, the map responds:

1. **Route drawing**: The polyline animates segment by segment as each chapter scrolls into view. By the final chapter, the complete route is drawn.
2. **Active marker**: The current chapter's marker pulses/glows. Previous markers are solid. Future markers are dim/outlined.
3. **Auto-pan**: Map smoothly flies to each stop's location as its chapter enters the viewport (using Intersection Observer).
4. **Cumulative feel**: Each chapter "adds" to the map — more route, more markers, more history layered onto the geography. The map builds up like the city did.

---

## Historical Imagery Strategy

- **Ghost overlays**: Historical photos with reduced opacity, positioned behind or beside narrative text. They feel like memories, not illustrations.
- **Then/Now pairs**: Where possible, show the historical site alongside what's there today. Side-by-side or a slider.
- **Full-bleed chapter heroes**: Keep the large chapter header images but add a subtle Ken Burns (slow zoom/pan) effect for atmosphere.
- **Source**: Wikimedia Commons, Library of Congress, Chicago History Museum digital collections (all public domain / free use).
- **Fallbacks**: Store key images locally in `/images/` rather than relying entirely on external URLs.

---

## Implementation Steps

### Phase 1: Structural Redesign (HTML + CSS)
1. Remove the dual-mode toggle system entirely
2. Restructure HTML: single scroll with persistent map sidebar
3. Build responsive layout (desktop sidebar / mobile mini-map strip)
4. Implement sticky map container that stays visible during scroll
5. Restyle header with flag elements as progress indicator

### Phase 2: Scroll-Driven Map Integration (JS)
6. Add Intersection Observer to detect which chapter is in viewport
7. Connect scroll position to map behavior (pan, zoom, route drawing)
8. Animate route polyline drawing as chapters are reached
9. Update marker states (dim → active → visited) based on scroll
10. Update flag/star progress indicator on chapter transitions

### Phase 3: Walking Mode (JS)
11. Implement "I'm Here" GPS activation that shifts layout (map expands, narrative compresses)
12. Calculate proximity-based stop ordering
13. Build the walking-mode layout (expanded map + companion panel)
14. Proximity notifications for nearby stops
15. Exit walking mode returns to scroll position

### Phase 4: Content & Polish
16. Restructure stops data (merge bookends, clean up multi-event stops)
17. Download and optimize key historical images locally
18. Add ghost-image overlays and Ken Burns effects on chapter heroes
19. Refine flag progress animation
20. Accessibility pass (alt text, ARIA labels, keyboard nav, skip links)
21. Add basic service worker for offline support (critical for walking mode)

---

## What We're NOT Doing
- No build tooling complexity (staying vanilla JS + CSS, maybe a simple bundler later if needed)
- No audio/narration (cool idea but separate effort)
- No user accounts or saved progress
- No backend — everything stays static/client-side
