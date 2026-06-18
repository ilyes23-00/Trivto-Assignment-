# Double Tap Like

## Overview

The feed now supports double tap to like directly on the image card. The gesture is designed to feel natural on mobile, stay out of the way of vertical scrolling, and preserve the existing accessible like button as the primary explicit control.

## Design Decisions

### Mobile Friendly Gesture

Problem:

- The gesture needs to feel native on touch devices instead of behaving like a desktop-only interaction.

Solution:

- The image card uses pointer events so touch input works cleanly on mobile browsers.
- A like is triggered only when two taps happen close together in both time and position.

Tradeoff:

- Timing and movement thresholds must be conservative enough to avoid accidental likes, which means very slow double taps will not count.

### No Interference With Scrolling

Problem:

- In a vertical feed, aggressive tap handling can conflict with swipe scrolling and make the feed feel sticky.

Solution:

- The card never calls `preventDefault`.
- The gesture is recognized on pointer up only when pointer movement stays below a small threshold.
- The card uses `touch-pan-y`, so the browser stays optimized for vertical scrolling.

Tradeoff:

- Some borderline gestures during motion will be treated as scrolls rather than likes, but that is preferable to harming feed navigation.

### Animation

Problem:

- A gesture like double tap needs immediate visual confirmation or it can feel uncertain.

Solution:

- A short centered heart burst animation appears only when a double tap successfully likes an image.

Tradeoff:

- The animation adds a little UI complexity, so it is intentionally lightweight and short-lived.

### Accessibility

Problem:

- Double tap is not an accessible primary control for keyboard and assistive technology users.

Solution:

- The existing `LikeButton` remains the explicit accessible control with `aria-label` and `aria-pressed`.
- The gesture only adds a secondary convenience path for touch users.
- Screen-reader-only helper text clarifies that the button remains the accessible interaction method.

Tradeoff:

- This keeps two interaction paths in the component, but it avoids making the gesture a required action.

## Behavior Summary

- Double tap only likes an image. It does not unlike on double tap.
- The gesture is ignored while a like write is already pending.
- The existing optimistic updates, rollback, and persistence flow remain unchanged because the gesture reuses the same like callback.
