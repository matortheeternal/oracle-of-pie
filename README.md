# oracle-of-pie

Reads Magic Oracle text into a semantic tree, suggests Scryfall oracle tags, and inspects cards for
color pie breaks. Card Magician uses it for tag suggestions and color pie inspections; the research
harness that measures it against Scryfall lives in cm-autotag.

Structured after sigil-sifter and mana-scribe: node classes with `static match` / `static parse`,
ordered strategy registries, and nodes that consume `remainingStr`.

Levels: CardText → abilities/ → statements/ (Sentence, statement registry) → clauses/ → effects/ →
phrases/ (+ modifiers/) → values/; costs/ use mana-scribe. resolvers/ link across sentences
(back-references). evaluators/ runs declarative queries over the tree; tags/ holds the tag queries.

Evaluate against Scryfall tags from cm-autotag with `npm run evaluate`.

Status (2026-11-17, modern corpus): 67% of cards fully recognized; tag micro precision 98.4%, recall 78.3%
(the removed Python spike: 56%, 97.6%, 71.9%).

Definitions: keywords, keyword actions and tokens are all a name plus reminder text. Matching nodes
(KeywordAbility, KeywordActionEffect, CreateTokenEffect) attach the parsed reminder as an Expansion; tag rules
see expansions, recognition coverage ignores them. Projects add or override definitions by name:

    new Oracle({ definitions: {
        keywords: [{ name: 'Siphon', reminder: 'Whenever this creature attacks, each opponent loses {parameter} life.' },
                   { name: 'Typecycling', pattern: /(?<type>[a-z]+)cycling/, reminder: '... a {type} card ...' }],
        actions: [{ name: 'Investigate', reminder: 'Create a Clue token.' }],
        tokens: [{ name: 'Lantern', typeLine: 'Token Artifact — Lantern', reminder: '{1}, Sacrifice this token: Scry 2.' }]
    } });

Tags are evaluators: data queries over the parsed tree. Keys are node properties (getters,
methods such as `hasType: 'creature'`, arrays match when some element matches, nested objects
query child nodes) or special predicates (`kind`, `any`, `not`, `card`, `effectOrder`, `context` to query the
enclosing ability/sentence/condition/card text, and `tag` to reuse other tags, e.g.
`{ tag: 'pure-draw', context: { ability: { isRepeatable: true } } }`). Triggered abilities
expose a parsed `event` (triggers/: enters, dies, attacks, cast, phase, deals damage). Values:
boolean, string/number, array (one of), RegExp, `null` (absent), or a nested query. Projects add
tags or override defaults by tag name:

    new Oracle({ tags: [{ tag: 'bounce-to-library',
        match: { kind: 'ReturnEffect', destination: 'library', phrases: { isOpposingObject: true } } }] });

New predicate kinds are classes in evaluators/predicates/ registered in order in its index.

Pie inspections (pie/) reuse the same queries. Each inspection is one break type with an id, so
users can disable it individually (`new PieInspector({ profiles, disabled: ['gain-life'] })`).
An inspection's match is attributed to colors: the face's mana cost, plus colored mana in the
ability's cost and enclosing abilities, plus kicker or "if {U}{U} was spent" conditions. Token
reminder text is colorless and skipped. Each inspection has a tier per color (primary, secondary,
tertiary, none) generated from canon frequency into pie/canonTierTable.js by cm-autotag's
`npm run pie`; exceptions override tiers for specific cases such as removal of flyers. A color
policy judges monocolored, gold, and hybrid cards (each way a hybrid cost can be paid); tertiary
colors bend and none breaks. Flags cite the matched text, its range in the original card text,
and printed examples.

References: ReferenceResolver links each back-reference to the nearest earlier compatible phrase within one
ability (Saga chapters share a scope; quoted abilities get their own). ExileEffect.isTemporary reads those links.
Next: "each of up to N target", "divided among N targets", "named <card>"; tests from review
verdicts.
