# Cinematic worlds — approved visual direction

User rejected the vector/card-level recolor as too basic and approved the illustrated 3×3 cinematic concept board. Build a real interface following that direction, not a flattened screenshot or another static mockup.

## Design
Full-width atmospheric hero, illustration as a dominant layer, independently selectable HTML headings/buttons, cinematic lighting, themed emblems and type, illustrated catalog, compact navigation and a nine-world gallery. Themes: pirates, Olympus, cyberpunk, steampunk, space/aliens, western, Candyworld, dinosaurs, phoenix. Fixed game IDs, filters and favorites survive theme changes. No invented balances, jackpots, testimonials or provider integrations. Adult-oriented concept only.

## Artwork provenance and limitation
Use precise illustration crops from the user-approved AI-generated concept board supplied in this conversation (1448×1086). Do not describe these crops as newly generated independent HD/4K renders. They are integrated concept artwork, not full-resolution production art; the system must permit one-file replacement per world. No screenshot navigation, buttons or text should be part of the interactive UI. Export previews honestly at their actual render resolution.

## Architecture
New primary index.html plus public/cinematic/{schema,motion,app}.mjs and styles.css. Reuse existing model.mjs game IDs/filter logic. Preserve old index at studio.html and all original modules. Static deployment unchanged. No added production dependencies. Binary AVIF assets are local and offline preview embeds the same assets.

## Acceptance
Nine visually different complete pages, mobile composition, real search/category/provider/favorite controls, modal previews, native dialogs and focus return. Safe URL allowlist and storage recovery. Minimal RAF particles and CSS motion stop for reduced-motion, manual off, hidden/offscreen document, and open dialogs. No external runtime requests. No Cloudflare deployment. Ship source, self-contained preview, screenshots and tests with explicit verification evidence.
