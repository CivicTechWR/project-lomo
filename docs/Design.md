# LoMo Design Documentation

## 1. Interview Summary

This design documentation was created from the current Figma exploration page and the active implementation patterns in the repo.

### Inputs captured
- Figma page: https://www.figma.com/design/PkhODp6MhS0iFGsGTfsrdA/LOMO---Prototype?node-id=351-464&t=cmbcL7HIpgaR06jO-1
- Scope: design system / component library
- Priority: visual design
- Output target: update this design doc in the repo

### Product intent
The primary goal of the design is to express LoMo as a calm, consent-based, community support platform. The visual language should feel warm, non-pressured, human, and practical rather than slick or gamified.

### Design goals
- Make help requests feel approachable and low-stakes
- Communicate trust, safety, and consent in every interaction
- Support a compact mobile-first flow without feeling crowded
- Maintain a tactile, hand-annotated design-system feel while still being technically implementable
- Keep the system reusable for multiple states and request types
- Ensure all user-facing surfaces share the same visual language and interaction rules
- Preserve clarity, hierarchy, and accessibility without overusing decoration

---

## 2. Design Direction

### Core visual mood
The page communicates a deliberately soft and grounded aesthetic:
- warm off-white and pale gray backgrounds
- earthy accent colors: terracotta, mustard, sage, and muted brown
- thick outlines and simple shapes rather than glassmorphism or polished neon styling
- card components that feel like physical note cards or paper forms
- low-contrast, calm contrast patterns rather than high-arousal color drama

### Brand behavior
This design language matches the project mission in the root README: LoMo is a calm, consent-based civic help platform designed to reduce social friction. The designs reinforce that by avoiding urgency cues, pressure-heavy layouts, and transactional visual language.

### Emotional signal
The overall design reads as:
- reassuring
- grounded
- community-centered
- gentle and practical
- high-trust, low-stress

This should be carried into the implementation: avoid making the app feel like a marketplace checkout flow or a social feed. The system should feel like “a safe community tool,” not a performance-centric app.

### Design principles to enforce
1. Buttons should have visible borders and clear focus treatment.
2. Links should read as links via underline or another clear text affordance, not color alone.
3. Primary actions should follow the strongest approved brand action, not a generic color rule — the current repo already favors terracotta for homepage CTA emphasis.
4. Clickable elements may use subtle elevation, but shadows should be selective and restrained so they do not overwhelm the content hierarchy.
5. Every user-facing page should share the same spacing, typography, button, and card language.
6. The product must be mobile-first, touch-friendly, and responsive across breakpoints.
7. Navigation should use a unified design grammar even when the homepage and app shell differ in structure.
8. The admin interface may have a distinct operating context, but it should still remain consistent with the same spacing, hierarchy, and interaction principles.

---

## 3. Design System Observations from the Figma Page

### A. Layout patterns
The board contains multiple repeated screen patterns, suggesting a reusable system built around a few core structures:

1. Mobile-first cards
   - stacked or grouped vertically
   - compact internal spacing
   - clear grouping between sections
   - content hierarchy driven by labels, headers, and callouts

2. Multi-step onboarding / request flow
   - screens move through question prompts, options, and confirmation states
   - each state is a self-contained panel with a clear top area and action area
   - there is a strong rhythm between content and actions

3. Option selection patterns
   - stacked choice tiles / chips
   - simple binary choices and multi-select prompts
   - each option uses a visible, distinct visual state when selected

4. Bottom action bars
   - action rows appear anchored at the bottom of the mobile surfaces
   - actions are compact and consistent, with a clear back/next pattern

### B. Typography and information hierarchy
The visual hierarchy is based more on form structure and spacing than on huge type changes.

- Bold labels and short headings dominate
- Body text is intentionally compact and easy to scan
- Layouts rely on strong grouping instead of dense textual content
- The interface reads like a guided questionnaire rather than a text-heavy feed

### C. Shape language
The design uses:
- rounded corners on data entry and control surfaces
- boxy but softened containers
- strong borders that create structure
- a handcrafted, slightly illustrated feel rather than minimal flat UI

This matches the design system package conventions in the repo, especially the emphasis on rounded tokens and component-driven consistency. The design should not become an overdecorated “AI aesthetic” with excessive gradients, over-rotation, or uniform glossy surfaces.

### D. Interaction and affordance rules
The Figma language implies a careful balance between visual warmth and functional clarity:
- button affordances must be unmistakable
- selected states should read clearly without relying on color alone
- links should visibly read as links in context
- shadows should elevate actions without cluttering low-priority UI
- primary actions should stand out, but the overall experience should remain calm rather than high-pressure

---

## 4. Pattern Library Breakdown

### 1. Request / question card
This is the most important reusable pattern in the Figma page.

Typical structure:
- small top label or screen title
- question prompt
- a set of possible responses or choice blocks
- one primary action and optionally secondary action(s)

Behavioral intent:
- reduce user anxiety
- keep the form obvious and low friction
- turn complex asks into checkboxes / prompts with clear progression

Implementation guidance:
- Use a card or section container with consistent padding
- Use a `Label` + `Text` + `Field` stack
- Use `Button` for primary actions and lightweight secondary actions
- Use `CheckboxCard`, `CheckboxGroup`, or option tiles for response choices

### 2. Choice and preference controls
The design repeatedly uses segmented question choices, including:
- pills
- small toggles
- cards with selected state treatment
- simple option rows

Recommended treatment:
- default state = neutral background with border
- selected state = accent border and deeper fill or emphasis
- focus = clear 2px ring matching the design-system contract
- hover / pressed states should feel subtle and calm, not flashy

### 3. Status and summary cards
The set includes request review and summary states. These likely represent a “confirm before send” or “review details” pattern.

Typical pieces:
- title
- summary text
- short metadata chips or tags
- review actions

These should be built with `Card`, `Text`, `Badge`, and simple field rows rather than rich layout scaffolding.

### 4. Bottom navigation / action row
The bottom area suggests a consistent mobile navigation pattern, likely:
- back
- next / continue
- save / cancel
- secondary actions in a tighter row

This should map well onto the repo’s shared controls and spacing conventions.

### 5. Navigation system patterns
The homepage navigation and in-app navigation should not be treated as the same component in structure, but they should share the same underlying visual grammar.

- homepage nav can be more brand-forward and welcoming
- app nav should be functional and calm, optimized for repeated use
- both should honor the same typography, border treatment, colors, and affordances
- the product shell should remain consistent even when the layout role differs

**App shell navigation (verified, see §11.7):** the in-app nav (`AppSidebar`) uses Material Design 3's adaptive layout as its explicit behavioral reference — three structural tiers, one shared pill-based visual grammar:
- phone (`<768px`): a floating bottom pill bar
- tablet (`768–1023px`): a floating navigation rail
- laptop/PC (`≥1024px`): the same rail styling, attached to the viewport edge instead of floating

All three tiers use the same terracotta-outlined active-item pill, warm solid surface, and restrained elevation — only the phone tier is structurally distinct (bottom-anchored, Material 3's own bottom-bar vs. rail/drawer distinction), not stylistically different.

---

## 5. Color and Visual Language

### Palette direction
The board makes good use of warm, earthy tones that align with the project’s community-first identity.

Likely palette family:
- warm neutrals: cream, stone, soft gray, parchment
- terracotta / rust tones for emphasis and action cues
- mustard / amber as confirmation or highlighted accents
- sage green for calm trust cues and softer selection states
- brown / dark charcoal for text and anchors

This aligns with the repo’s design system conventions, especially the expectation of themed color scales in the `packages/ui` package. The current implementation already leans toward terracotta for strong primary actions on the homepage, which should be treated as an approved product decision rather than a generic rule that every surface must use yellow.

### Contrast and clarity
The design is not a high-contrast “dark mode” aesthetic. Instead, it prioritizes readable separation between surfaces and content with border-weight emphasis, soft fills, and strong heading contrast.

Recommended implementation rules:
- text should be dark enough for readability on warm neutral surfaces
- only use accent color for selected states, key actions, and emphasis
- avoid heavy use of bright saturated colors on large surfaces
- use decorative color sparingly so the interface feels grounded rather than over-styled

---

## 6. Relationship to the Current Codebase

The repo already has a shared component system that is well aligned with this design direction.

### Relevant design system modules
From the current package structure:
- `packages/ui/src/button/`
- `packages/ui/src/card/`
- `packages/ui/src/text-field/`
- `packages/ui/src/field/`
- `packages/ui/src/text/`
- `packages/ui/src/heading/`
- `packages/ui/src/checkbox/`
- `packages/ui/src/modal/`

The package conventions in `packages/ui/AGENTS.md` emphasize:
- accessible primitives from React Aria
- Tailwind-based styling
- warm-tinted neutral palette
- rounded, consistent interaction tiers
- components that behave like a design system rather than one-off mobile screens

### Implementation fit
The Figma page maps well to the existing library:
- `Card` for panels and request summaries
- `Button` for primary/secondary actions
- `TextField` / `Input` / `TextArea` for form entry
- `Checkbox` or `CheckboxCard` for option selection
- `Label` and `Field` for accessible form structure
- `Heading` / `Text` for hierarchy and labels

The page is not a system that needs radically different CSS conventions; it needs a disciplined application of the current tokens and component patterns. Importantly, the design language should be shared across the app rather than reinventing the homepage, onboarding, and functional screens as separate aesthetics.

---

## 7. Design-to-Implementation Guidance

### Recommended naming and structure
When translating the design into code, keep the interactions organized around the actual user flows rather than screen-by-screen visual exploration. Suggested structures:
- onboarding flow
- request composition flow
- offer / help matching flow
- review and confirm flow
- request detail / status flow

### Token decisions to preserve
The patterns in the page suggest these design-system choices should stay stable:
- warm toned basics over cool-blue or highly saturated brand colors
- medium-large rounded corners for cards and input groups
- clear border separation between interactive surfaces
- limited accent use for selected/primary states
- mobile safety and readability over visual density
- selective shadow usage for important interactions, not blanket elevation everywhere

### Accessibility notes
The page should prioritize:
- visible focus state on all interactive elements
- clear labels and instructions for each question
- a single primary action path per step
- enough spacing for touch interactions
- underline or strong textual affordance for links
- no “hidden required action” patterns that rely on color alone
- consistent contrast and readability across every status, callout, and action state

---

## 8. Proposed Documentation Structure for Future Handoff

### Page / flow summary
- Purpose: onboarding and request/offer creation flow
- Audience: community members seeking or offering help
- Core task: answer a short series of guided questions
- Success metric: user completes the request with clarity and low friction

### User flow
1. Start with onboarding or welcome state
2. Answer the initial help / request questions
3. Choose category or context option
4. Add details or preferences
5. Review and confirm the submission
6. Return to the request list or status screen

### Content and interaction rules
- short, friendly prompts
- nonjudgmental and reassuring wording
- selection patterns that reduce decision fatigue
- visible progression and confirmation states

### Quality bar for future implementation
A screen is considered aligned with the design if it:
- feels calm and low-pressure
- maintains a consistent warm neutral palette
- clearly communicates the next step
- keeps inputs simple and actionable
- uses visible button borders and clear link affordances
- includes restrained, meaningful shadow treatment only where elevation helps
- is responsive and touch-friendly across devices
- does not feel like a checkout flow or a noisy social app

---

## 9. Recommended Next Step

The next implementation step should be converting this visual exploration into a consistent set of reusable patterns in the app-level flow and in the shared UI package. The strongest immediate candidates are:
- a reusable card-based question component
- a consistent choice tile pattern for help categories and preferences
- a compact mobile action row
- a review/confirmation layout for help requests

This will keep the product aligned with the design board while ensuring the repo’s component library remains the source of truth.

---

## 10. Final Design Positioning

LoMo’s product language should not feel like a marketplace, a social platform, or a performance-oriented productivity app. It should feel like a calm and trustworthy local support tool — one that makes asking for help feel emotionally safe and easy to act on.

That is the central design principle this Figma page is communicating, and it is the principle that should guide the implementation in the codebase.
