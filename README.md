# oracle-of-pie

A JavaScript library that reads Magic: The Gathering Oracle text into a semantic tree. Built on
that tree, it suggests Scryfall oracle tags for a card and inspects cards for color pie bends and
breaks, citing the evidence for each. It reads printed and custom cards alike, and new mechanics
can be declared through configuration.

    import { Oracle, PieInspector, CardColors } from 'oracle-of-pie';

    const parsed = new Oracle().parseFace({
        name: 'Sudden Downpour',
        typeLine: 'Instant',
        text: 'Destroy target creature with flying. You gain 2 life.'
    });
    parsed.tags;             // Map: 'removal-destroy' → evidence, …
    parsed.isFullyRecognized;

    const colors = CardColors.fromManaCost('{1}{U}');
    new PieInspector().inspect([{ parsed, colors }]);
    // flags: destroy-creature breaks in U, gain-life breaks in U

Structured after sigil-sifter and mana-scribe: node classes with `static match` / `static parse`,
ordered strategy registries, and nodes that consume `remainingStr`.

Levels: CardText → abilities/ → sentences/ (registry of sentence kinds; clauses/ splits a sentence
into effects without adding nodes) → effects/ → phrases/ (+ modifiers/) → values/; costs/ use
mana-scribe. resolvers/ link across sentences
(back-references). evaluators/ runs declarative queries over the tree; tags/ holds the tag queries;
pie/ holds the color pie inspections.

Status (2026-11-18, modern corpus): 82.1% of cards fully recognized; tag micro precision 98.3%,
recall 78.9%. Goals and decisions are in `SUCCESS.md`; the tasks that measure them are under
Development below.

## How a card is read

`Oracle.parseFace` parses a face's text into a tree: abilities contain sentences, sentences contain
effects, effects contain phrases (the objects and players they act on), and phrases carry modifiers
("with flying", "you control"). Keywords, keyword actions and tokens that have definitions attach
their parsed reminder text as an Expansion child.

`ParsedCard.walk()` visits every node depth-first and yields `[node, context]`. The context is a
plain object each layer extends: `card`, `ability`, `abilities`, `sentence`, `condition`,
`delayedTrigger`, `parentEffect`, `effectDuration`, `granted`, `temporaryGrant`, `expansion`,
`origin`, `definitionOnly`, `forOpponent`. Tags and inspections skip nodes an opponent performs.

## Configuration

### Oracle

    new Oracle({ keywords, definitions, tags })

- `keywords`: keyword names the parser recognizes as keyword abilities and in "with/without …"
  phrases. Defaults to `DEFAULT_KEYWORDS`, which includes every keyword ability in the keyword
  canon (below); pass the full list to replace it.
- `definitions`: rules vocabulary, added to the defaults and overriding them by name (below).
- `tags`: tag specs, added to the default tags and overriding them by tag name (below).

### Definitions

    new Oracle({ definitions: {
        keywords: [
            { name: 'Siphon', reminder: 'Whenever this creature attacks, each opponent loses {parameter} life.' },
            { name: 'Typecycling', pattern: /(?<type>[a-z]+)cycling/, reminder: '... a {type} card ...' }
        ],
        actions: [
            { name: 'Investigate', reminder: 'Create a Clue token.' },
            { name: 'Discover', pattern: /discovers?/, findsRandomCard: true, reminder: '...' },
            { name: 'Goad', pattern: /goad [^,.]+/ }
        ],
        tokens: [{ name: 'Lantern', typeLine: 'Token Artifact — Lantern', reminder: '{1}, Sacrifice this token: Scry 2.' }],
        noncreatureSubtypes: ['Gizmo'],
        batchWords: ['lucky']
    } });

- `keywords`: a name and reminder text. `pattern` makes one definition cover a family of names;
  its named groups fill `{placeholders}` in the reminder, and `{parameter}` is the keyword's
  parameter (`Ward {2}` → `{2}`).
- `actions`: keyword actions such as scry or investigate. Every action the parser recognizes is
  one of these; there is no other list. `pattern` gives the action's full wording when it is more
  than its name: third-person forms (`connives?`) or a following object (`goad [^,.]+`); its
  named groups fill placeholders. `reminder` is optional; without one the action is recognized but
  not expanded. `{parameter}` is the action's amount (`Amass 2` → `2`). `findsRandomCard` marks
  actions that replace an object with a random card, for the random-replacement pie exception.
- `tokens`: predefined tokens such as Clue or Treasure, with their type line and ability text.
- `noncreatureSubtypes`: subtypes that are not creature types. A bare subtype such as "target
  Gizmo" is read as a creature unless declared here. The defaults list the noncreature subtypes
  canon card text refers to; declare a project's new artifact, enchantment or land subtypes.
- `batchWords`: lowercase adjectives that qualify objects the way `historic` or `outlaw` do
  ("target lucky creature"). Undeclared ones leave the phrase unrecognized, though their negation
  ("nonlucky") is always read as an excluded qualifier.

Creature subtypes need no declaration: any capitalized word in an object phrase that isn't a card
type is read as a subtype.

### Queries

Tags, pie inspections and exceptions all match with the same query objects. Each key/value pair
becomes a predicate; the value's shape picks its meaning:

| Write | Meaning |
|---|---|
| `kind: 'DestroyEffect'` or a list | the node's class or a superclass is one of these |
| `isTargeted: true` | the property or getter, read as a boolean, equals this |
| `hasType: 'creature'` | calls a method with the value, or compares a value (list values match when they include it) |
| `name: /regex/` | the string matches |
| `colors: ['W', 'U']` | the value is one of these |
| `delayedTrigger: null` | the value is absent |
| `phrases: { … }` | the child (or any item of a child list) matches the nested query |
| `any: [ … ]`, `not: { … }` | or, not |
| `card: { … }`, `context: { … }` | match the card or the walk context instead of the node |
| `tag: 'removal-creature'` | the node earns that tag |
| `effectOrder: [ … ]` | the sentence's effects appear in this order |

The first key of a query decides which nodes it applies to: a node without that key simply
doesn't match. Any later key the admitted node doesn't have throws a `QueryError`, so misspelled
keys fail on first use instead of silently never matching. Keys under `context` are not checked
yet.

Useful generic properties include `requiresKeyword: 'flying'` on objects ("creature with flying";
works for any keyword the oracle knows, including joined lists such as "with flying or reach"),
`hasType`, `hasQualifier`, `hasKeyword`, the exclusions `excludesType`, `excludesSubtype` and
`excludesQualifier` ("nonland", "non-Dragon", "nonhistoric"; `hasType` respects them, so a
"nonland permanent" is not a land), and on restrictions `exceptedBy`, the objects named in
"can't be blocked except by …". Wordings the phrase parser can't fully read leave `exceptedBy`
empty and keep the raw `exceptionText`.

New predicate kinds are classes in evaluators/predicates/ registered in order in its index.

### Tags

    new Oracle({ tags: [{ tag: 'bounce-to-library',
        match: { kind: 'ReturnEffect', destination: 'library', phrases: { isOpposingObject: true } } }] });

Every tag's query is tested against every node; the first match records the tag with its
sentence as evidence. Tags may build on other tags with `tag:`. A spec with `family` instead of
`tag` (such as `gives-{keyword}`) produces one tag per keyword its `keywords` property names.

### Pie inspections

    new PieInspector({ profiles, inspections, disabled: ['gain-life'] })

An inspection is one kind of color pie break:

    { id: 'destroy-creature', title: 'Destroys creatures', group: 'Removal',
      match: { kind: 'DestroyEffect', phrases: { isOpposingObject: true } },
      cites: 'Destroy target creature',
      atLeast: { W: 'tertiary' },
      allowedWherever: 'loot',
      exceptions: [ … ] }

- `match` or `tagInspection({ id, tag })`: what the inspection looks for. The first matching node
  on each face is judged.
- Tiers per color (`primary`, `secondary`, `tertiary`, `none`) come from layers, each loosening
  the last: canon frequency (pie/canonTierTable.js, generated by `npm run pie`), the
  cited Mechanical Color Pie line (`cites`), a hand-written floor (`atLeast`), and another
  inspection's canon tiers (`allowedWherever`). `tiers` replaces all of them.
- `exceptions`: `{ id, title, match, cites | tiers }`. An exception's query is tested against the
  node the inspection matched; the first match overrides the tiers of the colors it lists, either
  with its own `tiers` or with its cited line's.

The match is attributed to colors: the face's mana cost, colored mana in the ability's cost and
enclosing abilities, and kicker or "if {U}{U} was spent" conditions. A color policy judges
monocolored, gold and hybrid cards (each way a hybrid cost can be paid): tertiary colors bend and
none breaks. Flags report the matched text and its range, the citation and exception that
applied, and for each card color its tier and the layer that chose it (`tiers: { B: { tier:
'secondary', source: 'MCP Haste' } }`).

`inspectionsUsedBy(cards)` returns the inspections that match at least one of the given cards
(each an array of faces), for showing only the inspections a project exercises.

An inspection's optional `mentions` text skips faces whose text doesn't contain it, so the
inspection's query never walks them. Use it only when every match must name that text.

### Keyword inspections

Every keyword ability gets an inspection in the Keywords group that matches having, gaining or
giving it, or putting its counters. Each carries metadata for presenting about two hundred of
them:

- `keyword`: the keyword name.
- `subgroup`: `Evergreen` for the keywords the Mechanical Color Pie rates (cited, with their
  exceptions); `Returning` for keywords printed in at least three sets; `Set mechanics` for the
  rest.
- `canonCount`: how many canon cards the tiers were drawn from.

Keyword tiers come from pie/keywordCanon.json, generated by `npm run keyword-canon`
from every English, non-digital first printing in a canon set type, using Scryfall's keyword
list. Keyword actions and ability words are left out: a keyword counts as an ability when most
of the cards listing it print it as an ability line. A keyword takes the colors of the faces
that print it. Tiers use the canon frequency thresholds, except that any color with a
monocolored printing is at least tertiary; a keyword with no monocolored printing counts every
colored printing instead.

`keywordInspections({ climbing: tiers })` builds keyword inspections from a project's own tiers.

## Development

The research tasks in tasks/ measure the library against printed cards and against reviewed
verdicts. Install with `npm install`, download Scryfall's `default-cards` and `oracle-tags` bulk
files into the repository root, then build the corpus of cards printed since 2016. Older cards
count only when reprinted in an expansion or core set, since those reprints are chosen for
current play:

    npm run corpus -- default-cards-*.jsonl.gz oracle-tags-*.jsonl.gz

Generated data goes to data/ and queues/; review verdicts and baselines are kept in reviews/.

| Command | Does |
|---|---|
| `npm run evaluate` | Tags the corpus (`data/predictions.json`) and prints per-tag precision and recall against Scryfall, including parent tags. |
| `npm run diagnose -- spans [n]` | Most common text the parser did not recognize. |
| `npm run diagnose -- fps\|fns <tag> [n]` | Sample of false positives or false negatives for a tag. |
| `npm run gaps [n]` | Unrecognized text grouped into shapes, ranked by how many cards each alone keeps from full recognition, plus gap families by parser context and the most common opaque effects. Full data in `data/gap-report.json`. |
| `npm run queues` | Builds the custom-card queue from the projects in `reviews/projects.json` and the Scryfall disagreement queues. Run `evaluate` first. |
| `npm run review` | Serves the review UI at http://127.0.0.1:5178 (keys: 1 correct, 2 wrong, S skip, Z back, N note). `/ast` explores a card's parse tree, node properties, back-reference links, and the tags and pie inspections matching each node. |
| `npm run verdicts` | Re-tags every reviewed card and fails if a verdict no longer holds. Disagreements listed in `reviews/known-disagreements.json` are reported as `known`; `-- --accept-known` records the current set. |
| `npm run report` | Per-tag precision from automatic agreement plus review verdicts. |
| `npm run pie` | Builds per-inspection color profiles and the canon tier table from the modern corpus, then reports how many printed cards each inspection flags. |
| `npm run pie-gate` | Estimates the wrong-flag rate per color policy from the reviewed `printed-*-pie-flags` queues and checks it against the targets in `SUCCESS.md`. |
| `npm run pie-verdicts` | Re-inspects every reviewed pie flag and fails if a verdict changed or regressed; `-- --accept` records the baseline. |
| `npm run keyword-canon` | Rebuilds `src/pie/keywordCanon.json` from the `default-cards` dump. |
| `npm run lint` | Lints src/ and tasks/. |

Canon card colors come from mana costs, or a face's color indicator when it has no cost, so
devoid cards count in their cost's colors.

### Custom card review

The custom-card queues read Card Magician projects (`.cmproj` with YAML card files), listed by
name and folder in `reviews/projects.json`. Custom cards are parsed with their project's custom
keywords. Keywords the parser does not already know are harvested from reminder-text lines such
as `Grind (Whenever this creature deals combat damage, …)` and from reference entries such as
`*Barrier [cost]*: …`; a parameter like `{2}` or `[cost]` becomes `{parameter}`. A project can
override the harvest with a `customKeywords` list, matched by name:

```yaml
customKeywords:
  - name: Rush
    reminder: You may cast this spell for {parameter} less.
  - name: Escort
    disabled: true
  - name: Climbing
    tiers: { W: secondary, U: primary, B: tertiary, R: none, G: none }
```

A keyword with `tiers` gets a keyword inspection judged like the built-in ones; an omitted color
counts as `none`. `npm run queues` writes each project's keywords to `data/custom-keywords.json`.

Verdicts are appended to `reviews/<queue>.jsonl`; the latest verdict per item wins. Pending
suggestions alternate across tags, starting with tags that have the fewest verdicts; tags with 20
or more verdicts and none wrong come last. Custom card suggestions skip tags already on the card,
and a parent tag is not suggested when a child tag you have not rejected already implies it.

## References

ReferenceResolver links each back-reference to the nearest earlier compatible phrase within one
ability (Saga chapters share a scope; quoted abilities get their own). ExileEffect.isTemporary reads
those links.
