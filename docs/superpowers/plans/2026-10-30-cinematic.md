# Cinematic worlds implementation plan

> **For agentic workers:** Use superpowers:executing-plans.

**Goal:** Replace the flat theme treatment with the approved cinematic art direction in functioning templates.
**Architecture:** Existing model, new presentational shell, independent motion controller, local themed imagery. Preserve legacy shell.
**Tech Stack:** Native ES modules, CSS, HTML, AVIF, Canvas 2D, Node tests, Playwright.
**Spec:** ../specs/2026-10-30-cinematic.md

## Global constraints
No production deployment, betting or authentication backend. No external dependencies at runtime. Keep original game identities and favorite key. Disclose source-art resolution limits.

## Review focus
Unknown/prototype URL IDs, blocked storage, focus after removal/switching, reduced-motion vs manual setting, missing imagery and canvas availability.

- [x] Write/run failing configuration and preference tests.
- [x] Implement schema and isolated motion controller; run unit tests (8/8 passed locally).
- [x] Build cinematic layout and interactions over the existing catalog.
- [x] Test offline preview of nine themes at six widths, motion, dialogs and filter/favorite state.
- [x] Inspect actual screenshots; repair image-edge seam and mobile layout.
- [ ] Publish files with guarded main update; verify HTTP CI and record its outcome.

Local Chromium HTTP navigation is blocked by the environment (ERR_BLOCKED_BY_ADMINISTRATOR). That policy was not bypassed: local screenshot and interaction checks used set_content with our self-contained project HTML. Native HTTP/module/storage tests are delegated to the repository's GitHub Actions workflow. Offline tests are not represented as HTTP persistence evidence. No independent reviewer was available; code review is by the implementer.
