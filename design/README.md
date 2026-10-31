# Visual references

Eight separate images were generated with the built-in image generation tool,
then visually inspected before frontend implementation. Originals are preserved
in the owner's .codex/generated_images folder. These copies are unmodified.

## Visual system

- Ink: #101114; warm ivory: #F3F0E9; cobalt: #245BFF.
- Flat editorial composition, oversized grotesk typography, thin rules, and
  asymmetric project layouts. Avoid nested cards and ornamental UI clutter.
- Generous desktop gutters (roughly 4-5vw), section spacing around 96-144px,
  and a compact 20-24px gutter on small screens. Scale headings with clamp().
- Hero: dominant text at left, fine-line data sphere at right. The readable
  text and primary action take priority over the decoration.
- Project imagery: cobalt ocean contours for Parola, ink shield/flow motif
  for BantAI Buddy, architecture-driven imagery for other projects.
- Services: ruled rows. Process: a connected sequence. About: asymmetric
  portrait and biography. Contact: cobalt field with understated form lines.
- Inter Tight variable (100-900) is the actual locally bundled family. It
  replaces the planned Instrument Sans because the latter was unavailable
  offline. Do not label the bundled font as Instrument Sans.
- No IBM Plex Mono was found; use Courier New or another system monospace
  fallback for compact metadata. No system font file is redistributed.
- Font face and SIL OFL license are in ../public/fonts/.

## Reference map

| File | Intended reference |
| --- | --- |
| hero.png | Desktop homepage opening and typography/sphere balance |
| work.png | Selected-work editorial composition and concept art |
| services.png | Expertise typography and three ruled service rows |
| process.png | Dark connected three-stage working process |
| about.png | Portrait/copy proportions and recognition placement |
| contact.png | Cobalt inquiry section and footer |
| case-study.png | BantAI Buddy case-study opening and architecture layout |
| mobile.png | Mobile hierarchy, wrapping, and section transition |

## Content and asset rules

These are design mockups, not product evidence. All factual copy, roles,
recognition, and project descriptions come from lib/projects.ts and content/*.mdx.
Generated text is not authoritative. In particular:

- The mobile mockup invents a Parola knowledge-platform description and a laptop
  product interface. Do not use that copy or interface as a product screenshot.
- The about mockup's portrait is synthetic. Use the owner's real profile image.
- The case-study mockup includes illustrative contracts and ownership phrasing.
  Use the supplied BantAI Buddy API shape and the documented personal roles.
- Generated project artwork must be described as concept/architecture artwork.
  The original event announcements are documentary assets and remain separate.
- Do not embed entire reference screenshots as functioning webpage sections.
  Recreate layouts as semantic, responsive HTML, CSS, and code-native visuals.

The production interface should preserve the reference spacing, scale contrast,
and palette while using source-grounded copy and accessible interactions.
