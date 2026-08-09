# Forge & Frame

Product design engineering site — CAD, CFD, CAE. Built with Vite + React 19 + React Three Fiber.

## Design system (current): Claymorphism, blue/burgundy

The visual identity was fully reworked from the original brutalist/technical
look to a soft claymorphic system, per client feedback after seeing the
brutalist version live:

- **Palette**: blue-primary (`--primary #3b5fcc`), burgundy accent
  (`--accent #7a2e3d`), cool blue-toned "clay" surfaces (not white/gray —
  claymorphism's shadows need a color to bounce off of).
- **Typography**: Syne (all headings/titles, every size) + Roboto (body
  copy). JetBrains Mono is intentionally kept, but scoped specifically to
  technical/data content (specs, coordinates, timestamps, filter-tag
  labels) per the client's explicit request — it's not used for headlines
  or body copy anywhere.
- **Signature surface treatment**: `.clay` / `.clay-raised` / `.clay-inset`
  utility classes in `global.css` — a puffy rounded surface with a dual
  soft shadow (cool blue-gray dark side, white light side), never a flat
  drop-shadow or hard border. Buttons, cards, form fields, and the header
  all use this.
- **One deliberate holdover**: `--tech-panel` (a dark navy surface) is the
  one place the old "technical" feel survives — used for the exploded-view
  stage, the symptom-checklist band, and other moments that benefit from a
  darker, denser treatment, always paired with mono type.

### Bugs fixed during this pass (found via live deployment, not this sandbox)

- **Black artifact under the hero car**: `ContactShadows` was positioned
  exactly coplanar with the car's ground contact point (`y=0` for both),
  causing GPU z-fighting that rendered as a solid black shape instead of a
  soft shadow. Fixed by offsetting the shadow plane slightly below
  (`y=-0.015`).
- **Scrolling felt broken over the hero**: `OrbitControls`' `enableZoom`
  captures the mouse wheel for camera zoom by default, which means
  scrolling the page while the cursor happened to be over the 3D panel
  zoomed the car instead of scrolling — confirmed via search against
  known react-three-fiber/drei behavior. Fixed by setting
  `enableZoom={false}` (drag-to-orbit and touch still work).
- **Logo/header blocking browser tabs while scrolling**: the header used
  `mix-blend-mode: difference` to stay readable over both light and dark
  hero content. This is a fragile technique that can visually glitch
  against compositing edges. Replaced entirely with a solid claymorphic
  floating pill header — no blend modes anywhere in the site now.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Pages — all built and functional

- **Home** (`/`) — hero with 3D orbit-controllable model, animated slogan reveal,
  CAD/CFD/CAE hover tracks (wireframe draw, fluid sim, stress pulse)
- **Projects** (`/projects`) — horizontal-scroll portfolio gallery with track
  filtering, a live physically-animated exploded-view assembly, and a WebXR /
  AR section shell (see "Known limitations" below)
- **About** (`/about`) — video-game-style team stat cards with scroll-triggered
  bar fills, specialty/weakness callouts, social handles
- **Student Help** (`/student-help`) — ad-style emergency intake page with a
  real hook, symptom checklist, and a working validated form with an
  Emergency / General tab switch and urgency-tier picker
- **Contact** (`/contact`) — project inquiry form with validation, plus a
  direct-contact info panel

## Project structure

```
src/
  components/
    Header.jsx / .css          -- nav, mix-blend-mode difference, mobile menu
    Footer.jsx / .css
    Hero3D.jsx / .css          -- Canvas wrapper, OrbitControls, seamless panel blend
    MechanicalModel.jsx        -- UNUSED, kept from before the real hero model was added (see note below)
    PorscheModel.jsx           -- homepage hero 3D model: real 1975 Porsche 911 (930) Turbo, CC-BY-4.0
    ExplodedAssembly.jsx       -- exploded-view part geometry + explode/reassemble physics
    ExplodedViewCanvas.jsx     -- exploded-view Canvas wrapper with button + slider controls
    HoverTileCanvas.jsx        -- lightweight Canvas wrapper shared by CAD/CFD/CAE hover tiles
    CadAssembly.jsx            -- CAD hover tile: parts fly together into a structure on hover
    NozzleFlow.jsx              -- CFD hover tile: venturi nozzle with continuity-driven particle flow
    DragPlane.jsx               -- CAE hover tile: airplane with deflected streamlines + visible drag wake
    EngineAssembly.jsx         -- unused (kept from a prior iteration) -- 3D engine, stress-pulse material
    Tracks.jsx / .css          -- CAD / CFD / CAE hover panels
  pages/
    Home.jsx / .css
    Projects.jsx / .css
    About.jsx / .css
    StudentHelp.jsx / .css
    Contact.jsx / .css
  data/
    projects.js                -- portfolio card data (swap in real projects here)
    team.js                    -- team roster data (swap in real photos/stats here)
  styles/
    global.css                 -- design tokens, fonts, baseline animation, base styles
```

## CAD / CFD / CAE hover tiles (homepage)

All three tiles in the `Tracks` section run real, live 3D scenes — not
SVG, CSS, or 2D canvas tricks. Each mounts a small `<Canvas>` (via
`HoverTileCanvas`) only while that specific tile is hovered, so idle
tiles cost nothing:

- **CAD tile** (`CadAssembly.jsx`): 6 parts start scattered outward and
  fly into an assembled structure. Uses a quintic ease-out with a small
  (<1%) overshoot-and-settle for a soft landing rather than an abrupt
  stop, and the group's idle rotation is delta-time based so spin speed
  stays consistent across refresh rates. Replays from scratch on every
  hover (each hover creates a fresh component instance with fresh
  refs — see comments in the file).
- **CFD tile** (`NozzleFlow.jsx`): a physically-shaped venturi nozzle
  (wide inlet → narrow throat → wider outlet) built with `LatheGeometry`
  — a real revolved profile, not stacked cylinders. ~90 particles flow
  through it; their speed scales inversely with the nozzle's local
  cross-sectional area at that point (continuity equation: A₁v₁ = A₂v₂),
  so flow visibly accelerates through the throat, and turbulence
  (positional jitter) ramps up only downstream of the throat, matching
  where real flow separates in a diffuser.
- **CAE tile** (`DragPlane.jsx`): a simplified airplane (fuselage, main
  wings, tail, vertical fin) with ~70 streamline particles flowing past
  it. Streamlines within the fuselage's radius deflect outward as they
  pass (can't flow through a solid body), then straighten out after.
  Directly behind the tail, particles slow to 35% speed and visibly
  bunch up — that bunching/thickening wake is the drag force made
  visible, rather than a separate arrow icon.

  Note: `EngineAssembly.jsx` (a 3D engine block with emissive
  stress-pulse material) is still in the codebase from an earlier
  iteration but is no longer imported anywhere — kept in case it's
  useful for a project detail page later. It's correctly tree-shaken
  out of the production bundle (verified: zero bytes added).

All three are placeholder geometry built from primitives, same swap
pattern as `MechanicalModel.jsx` — replace the primitive meshes with a
`useGLTF()` call once you have real models.

## Swapping in real content

**3D model (homepage hero):** The hero canvas now loads a real model —
"FREE 1975 Porsche 911 (930) Turbo" by Lionsharp Studios, via Sketchfab,
licensed CC-BY-4.0. Source files live in
`public/models/porsche-930/` (scene.gltf, scene.bin, textures/, license.txt).

Important, honest caveats about this model:
- **26 of 27 textures are present.** `930_rim_metallicRoughness.jpg` is
  still missing — the rims will show correct color but without the
  metallic sheen map. Drop the file into
  `public/models/porsche-930/textures/` when you have it (convert to
  `.jpg` first, matching the rest — see the compression note below); the
  gltf already references it by that filename, no code changes needed.
- **Textures were compressed from ~47MB to ~4MB** (the model folder
  overall from 56MB to ~13MB) after the original Sketchfab export came
  in at up to 4096×4096 PNG per texture — far higher resolution than a
  homepage hero element needs on screen. Every texture was downscaled to
  a 1024px max dimension and converted to JPEG (quality 88), except the
  two that genuinely need alpha transparency
  (`930_lights_baseColor.png`, `930_stickers_baseColor.png`), which stay
  PNG. Verified the JPEG conversion didn't meaningfully degrade the
  normal maps by diffing pixel values against the originals (mean
  difference ~5/255 per channel — visually negligible at this display
  scale). The gltf's `images[].uri` entries were updated to match the
  new `.jpg` filenames.
- **`scene.bin` (8.8MB) is the single largest file** in the model
  folder now, comfortably under GitHub's 25MB per-file upload limit.
- **`PorscheModel.jsx` auto-fits the model at runtime** using
  `THREE.Box3` rather than a hand-calculated fixed scale, because the
  raw model measures ~240 units on its longest axis and manually
  decomposing the gltf's baked-in root transform matrix to derive an
  exact scale constant had real ambiguity (verified via web search: the
  axis mapping after a -90° X rotation is easy to get backwards). The
  runtime measurement is more reliable than that hand calculation would
  have been.
- **The `OrbitControls` target Y value (`0.35`) is an estimate**, not a
  verified number — this sandbox can't render and visually inspect the
  loaded model. If the camera looks noticeably above or below the car
  body once you view it live, that's the one number to adjust (in
  `Hero3D.jsx`).
- **CC-BY-4.0 requires visible attribution.** This is already rendered
  at the bottom of the hero canvas via the `CREDIT_LINE` export from
  `PorscheModel.jsx` — don't remove it without adding equivalent credit
  elsewhere on the page.

`MechanicalModel.jsx` (the original placeholder mechanical housing) is
still in the codebase but no longer imported anywhere — kept in case
it's useful elsewhere (e.g. a fallback, or a different project card).

**Portfolio projects:** Edit `src/data/projects.js`. Each entry drives a
gallery card automatically — add a `photo` field and update `.proj-card
.card-bg` in `Projects.css` to use a real image instead of the gradient
placeholder once you have project photography.

**Team:** Edit `src/data/team.js`. Set `photo: '/team/name.jpg'` (image
dropped into `public/team/`) and it replaces the initials placeholder
automatically — see the fallback logic in `About.jsx`.

**Forms (Student Help + Contact):** Both forms validate and show a real
success state, but the actual submit handler is a simulated delay — it
does not send anywhere yet. Wire `handleSubmit` in `StudentHelp.jsx` and
`Contact.jsx` to a real endpoint (Formspree, a serverless function, or an
email API) when you're ready to receive submissions.

## Known limitations / next steps

- **WebXR walkthrough & AR QR-scan** (`/projects`, "WebXR" section): the UI
  shell is built (panels, copy, disabled walkthrough button, placeholder QR
  block) but the actual first-person navigation and AR model-viewer need a
  real GLTF of an architectural project to be meaningful — these are wired
  to activate once a real model is connected.
- **Google Meet / Discord booking** (mentioned in original brief): not yet
  built as a page. Needs a booking backend or calendar API before a UI is
  worth building.
- **Bundle size:** three.js/R3F is isolated into its own chunk via
  `vite.config.js` manualChunks (so non-3D pages load faster), but it's
  still a large chunk — that's inherent to using a 3D library, not a bug.
  Further optimization would mean lazy-loading the 3D components
  per-route with `React.lazy`.

## Design tokens

See `:root` in `src/styles/global.css`:
- `--ink` #0a0a0a, `--paper` #f2f0ea — primary palette
- `--safety` #ff4b1f — signature accent (baseline animation, hover states, emergency CTAs)
- `--cad-c` #ffb400 / `--cfd-c` #2ea6ff / `--cae-c` #ff4b4b — per-track accent colors
- Fonts: Anton (headings), Oswald (body), JetBrains Mono (technical/data labels)
