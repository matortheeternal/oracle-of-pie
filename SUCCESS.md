# cm-autotag: definition of success

## Priorities
1. **Tag suggestions (primary, expected to ship).** Suggest Scryfall oracle tags for card-magician cards; the designer accepts or dismisses each one.
2. **Color pie inspections (expected to ship).** Flag color pie bends and breaks on card-magician cards as toggleable inspections, each citing its evidence. Started as an experiment; review results (2026-11-18) made it a shipping goal.

The parser, tags, and inspections live in the sibling repository oracle-of-pie; this repository is the harness that measures them.

## Decisions
- Tag vocabulary: Scryfall oracle tags. A limited supplement only for the largest gaps, as measured.
- Pie: the modern pie only (cards printed 2016 and later, plus older cards reprinted in expansion or core sets since then). Users of older-era sets can disable pie suggestions.
- Inspections favor avoiding false positives over catching every break.
- Each inspection has a tier per color (primary, secondary, tertiary, none) derived from canon card frequency. Tertiary flags a bend, none a break. Hand-written exceptions refine specific cases, and designers override defaults per project.
- Default tiers are never stricter than the Mechanical Color Pie 2021 line an inspection or exception cites, and every flag shows that citation. Where the article is silent, a few hand-written floors record reviewed judgments (for example, white self-mill is a bend).

## Tagging success
- A tag ships only if its suggestion precision is at least 95% against the Scryfall oracle tags, after hand review of disagreements (many apparent false positives are untagged Scryfall cards).
- Recall is reported per tag but doesn't block shipping.
- Every card reports whether all of its abilities were recognized, so silence is never mistaken for approval.

## Pie success
- Primary gate: few wrong flags on printed modern cards (target: monocolor ≤ 0.5%, hybrid ≤ 2% of cards).
  A flag on a printed card is not automatically wrong, since printed cards do bend the pie. A flag is wrong when the text was misread, the colors were misattributed, or the effect is fine in those colors.
  The rate is measured by hand review: every flagged hybrid card, and a fixed sample of 50 flagged monocolored cards (`printed-*-pie-flags` queues). `npm run pie-gate` multiplies the share of reviewed cards with a wrong flag by the share of cards flagged.
- Hybrid fixes came from reviewing these same cards, so its pass is optimistic until newly printed hybrid cards are reviewed.
- Secondary: the catch rate on a labeled break set (synthetic breaks, community-sourced breaks, Scryfall `color-break`).
- Every flag cites a color distribution and printed examples, checkable the way a Scryfall search is.
- Later: compare against an LLM baseline on the same labeled set.

## Open questions
- Plasma Caster: red exile on a coin flip, only against creatures that chose to block. It is chaotic rather than polymorph, and blocking is an opt-in risk. Currently flagged as a red break; revisit before deciding between a bend, an exception, or leaving it.

## Non-goals
Full rules-text parsing, authoritative verdicts, balance or power evaluation, the semantics of custom mechanics.
