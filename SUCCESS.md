# cm-autotag: definition of success

## Priorities
1. **Tag suggestions (primary, expected to ship).** Suggest Scryfall oracle tags for card-magician cards; the designer accepts or dismisses each one.
2. **Pie-break inspection (experimental).** Determine whether conventional algorithms can flag color pie breaks reliably enough to ship. An acceptable outcome is "no", with LLM assistance as the alternative to evaluate.

## Decisions
- Tag vocabulary: Scryfall oracle tags. A limited supplement only for the largest gaps, as measured.
- Pie: the modern pie only (cards first printed 2016 and later). Users of older-era sets can disable pie suggestions.
- Inspections favor avoiding false positives over catching every break.
- Maro's mechanical color pie table and bend severity tiers: out of scope for now; possible later spike.

## Tagging success
- A tag ships only if its suggestion precision is at least 95% against the Scryfall oracle tags, after hand review of disagreements (many apparent false positives are untagged Scryfall cards).
- Recall is reported per tag but doesn't block shipping.
- Every card reports whether all of its abilities were recognized, so silence is never mistaken for approval.

## Pie experiment success
- Primary gate: few false alarms on printed modern cards (target: monocolor ≤ 0.5%, hybrid ≤ 2%).
- Secondary: the catch rate on a labeled break set (synthetic breaks, community-sourced breaks, Scryfall `color-break`).
- Every flag cites a color distribution and printed examples, checkable the way a Scryfall search is.
- Compare against an LLM baseline on the same labeled set to answer the conventional-vs-LLM question with data.

## Non-goals
Full rules-text parsing, authoritative verdicts, balance or power evaluation, the semantics of custom mechanics.
