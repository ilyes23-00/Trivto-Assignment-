# AI Workflow

## Overview

AI was used as a coding assistant, not as an autopilot. The workflow was closer to pair programming than one-shot generation:

- inspect the repo
- implement one feature at a time
- run tests and lint after each meaningful change
- fix issues that showed up at runtime or in verification
- keep architecture and behavior aligned with the assignment rules

## Realistic AI Usage

The assistant was most useful for:

- turning requirements into concrete code changes quickly
- keeping file structure consistent with the planned architecture
- drafting supporting documentation after the implementation settled
- generating tests for behavior that had just been added

The assistant was less useful when:

- a runtime issue depended on the exact behavior of the local React/Next environment
- implementation details needed to be adjusted after seeing a real error instead of just reading the code

## Prompts Used

Representative prompts used during implementation:

- "read the full code"
- "Implement infinite scrolling."
- "Implement Like functionality."
- "Implement all graceful states."
- "Implement performance improvements."
- "Implement stretch goal. Double tap to like."
- "Generate documentation."

These were not giant all-in-one prompts. The work was broken into focused steps so each feature could be implemented and verified before moving on.

## One AI Mistake

The assistant initially used `useEffectEvent` inside the infinite-scroll hook.

Why it was a mistake:

- the code was logically fine
- but the local runtime did not expose `useEffectEvent` the way the implementation assumed
- that produced a real runtime error instead of a compile-time error

## How The Mistake Was Detected

It was detected by running the app and seeing the runtime failure:

- `useEffectEvent is not a function`
- the stack trace pointed directly at `src/hooks/use-infinite-feed.ts`

This was a good reminder that passing tests and lint are not enough for interactive UI work.

## How The Mistake Was Corrected

The hook was updated to use a stable `useCallback` loader instead of `useEffectEvent`.

That kept the required behavior:

- `IntersectionObserver` still triggered pagination
- duplicate requests were still blocked
- stale responses were still ignored
- cleanup still aborted in-flight work on unmount

The fix was then verified with tests and lint again.

## Verification Process

The verification loop was consistent across features:

1. Read the current implementation before changing it.
2. Make the smallest complete change that satisfied the current requirement.
3. Run:

```bash
npm test
npm run lint
```

4. If a runtime or UI issue appeared, fix it before moving to the next feature.
5. Add or update tests when behavior changed.

## Human Review

Human review still mattered throughout the process:

- requirements were broken into smaller checks before code was accepted
- generated code was read in the local repository instead of trusted blindly
- runtime failures and behavior mismatches were treated as review findings, not as acceptable output
- documentation was rewritten to match the actual final codebase rather than leaving raw generated text in place

## What Was Not Exaggerated

- AI did not invent the architecture from scratch without review.
- AI did not replace testing.
- AI did not produce perfect code on the first attempt every time.
- The final implementation still depended on iterative debugging, validation, and judgment.
