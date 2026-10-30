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
- [x] Publish files with guarded main update; verify HTTP CI and record its outcome.

## Verified outcome — 2026-10-30

Implementation commit: `3f5c6f70f3bd00457c0e509d55994f18e9f27def`.
GitHub Actions run: https://github.com/Shisetsu-Code/Temas/actions/runs/41097757642
Job `124207830298`: completed, success. All steps passed.

- 32 Node unit tests: 32 passed, 0 failed.
- Legacy browser suite: 9 passed; legacy worlds: 8 passed.
- Cinematic browser suite: 11 passed. Total browser tests: 28 passed.
- Standalone HTML export succeeded; screenshots and preview uploaded as `interface-screenshots`, artifact `9889955182`.

Native HTTP tests verified module loading, nine themes at six widths (360/390/768/1024/1440/1920), state preservation, reload persistence, corrupt/blocked storage, URL allowlist, keyboard focus, motion gates, missing-art fallback and no external requests.

## Scope and limits

Local Chromium HTTP navigation is blocked by the environment (ERR_BLOCKED_BY_ADMINISTRATOR). That policy was not bypassed: local screenshot and interaction checks used set_content with our self-contained project HTML. Native HTTP/module/storage verification then passed in GitHub Actions. Offline checks are not represented as HTTP persistence evidence. No independent reviewer was available; code review is by the implementer. Browser verification covered Chromium, not every engine or a full accessibility audit.

Artwork uses crops of the approved concept board; individual HD/4K illustrations remain necessary for production-quality full-screen sharpness. The source and dimensions are documented in the asset manifest. Environmental CSS/Canvas animation is not character rigging or 3D animation.

The previous interface is preserved at `studio.html`. No Cloudflare deployment, real accounts, payments or provider integrations were performed. This documentation-only change does not modify the verified implementation.
