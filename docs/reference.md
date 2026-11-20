# Project reference

[Back to the README](../README.md)

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

```js
new Oracle({ keywords, definitions, tags })
```

- `keywords`: keyword names the parser recognizes as keyword abilities and in "with/without …"
  phrases. Defaults to `DEFAULT_KEYWORDS`, which includes every keyword ability in the keyword
  canon (below); pass the full list to replace it.
- `definitions`: rules vocabulary, added to the defaults and overriding them by name (below).
- `tags`: tag specs, added to the default tags and overriding them by tag name (below).

### Definitions

```js
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
```

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

```js
new Oracle({ tags: [{ tag: 'bounce-to-library',
    match: { kind: 'ReturnEffect', destination: 'library', phrases: { isOpposingObject: true } } }] });
```

Every tag's query is tested against every node; the first match records the tag with its
sentence as evidence. Tags may build on other tags with `tag:`. A spec with `family` instead of
`tag` (such as `gives-{keyword}`) produces one tag per keyword its `keywords` property names.

### Pie inspections

```js
new PieInspector({ profiles, inspections, disabled: ['gain-life'] })
```

An inspection is one kind of color pie break:

```js
{ id: 'destroy-creature', title: 'Destroys creatures', group: 'Removal',
  match: { kind: 'DestroyEffect', phrases: { isOpposingObject: true } },
  cites: 'Destroy target creature',
  atLeast: { W: 'tertiary' },
  allowedWherever: 'loot',
  exceptions: [ … ] }
```

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

### Inspection catalog

Import the catalog from the npm dependency at build or registration time. The package
subpath can be bundled for the browser and runs offline.

```js
import { getInspectionCatalog } from 'oracle-of-pie/inspection-catalog';

const catalog = getInspectionCatalog();
```

The result is a plain object with `schemaVersion: 1` and `inspections` in registry
order. Each inspection includes its ID, title, group, optional subgroup (represented
by `null`), description, five effective color tiers, ordered exceptions, and examples.
Tier values are `primary`, `secondary`, `tertiary`, and `none`. Exception tiers list
only the colors the exception overrides. The function takes no arguments and returns a
fresh object on each call.

Examples are bundled from the November 2026 printed-card corpus and its inspection
profiles. The profiles identify cards by name. For multiface examples the catalog
includes every face in source order. Example rows contain only the face's name,
type line, mana cost, Oracle text, colors, power, toughness, and loyalty.
Power, toughness, and loyalty are strings when present and `null` otherwise.
An inspection with no recorded examples returns an empty array. Catalog generation
does not read project cards or evaluate inspections. A build can serialize the
catalog with `JSON.stringify(catalog)` for offline delivery.

#### Future card evaluation

A shared input could carry a stable card ID, its name and layout, and an ordered
array of faces. Each face would include name, type line, brace-form mana cost, Oracle
text, printed colors, and optional color indicator, power, toughness, and loyalty.
Keep printed stats as strings so values such as `*` survive normalization. Preserve
face boundaries and keep printed colors, mana-cost colors, and color identity distinct.

The Scryfall adapter can map `card_faces ?? [card]` and the existing snake-case face
fields. Card Magician can map `front` and `back`, combining type fields and normalizing
mana symbols and name macros as the custom project adapter already does. Keep both
adapters at the input boundary. Oracle can then derive the parser's face count from
the face array and apply a consistent color policy. This is a proposed evaluation
input and is separate from the catalog's example format.


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
| `npm run evaluate` | Tags the corpus (`data/predictions.json`) and prints per-tag precision and recall against Scryfall, including parent tags. The tagging summary counts trigger events as read, partial (a known event with text or a phrase it could not read) or unsupported; each card's counts are in its `events` field. |
| `npm run compare-corpus` | Saves and compares corpus outputs. See [Comparing corpus runs](#comparing-corpus-runs). |
| `npm run diagnose -- spans [n]` | Most common text the parser did not recognize. |
| `npm run diagnose -- fps\|fns <tag> [n]` | Sample of false positives or false negatives for a tag. |
| `npm run gaps [n]` | Unrecognized text grouped into shapes, ranked by how many cards each alone keeps from full recognition, plus gap families by parser context and the most common opaque effects. Text a trigger event could not read is labeled `unread <Event> text`, or `unsupported trigger event` when no event pattern matched. Full data in `data/gap-report.json`. |
| `npm run queues` | Builds the custom-card queue from the projects in `reviews/projects.json` and the Scryfall disagreement queues. Run `evaluate` first. |
| `npm run review` | Serves the review UI at http://127.0.0.1:5178 (keys: 1 correct, 2 wrong, S skip, Z back, N note). `/ast` explores a card's parse tree, node properties, back-reference links, and the tags and pie inspections matching each node. |
| `npm run verdicts` | Re-tags every reviewed card and fails if a verdict no longer holds. Disagreements listed in `reviews/known-disagreements.json` are reported as `known`; `-- --accept-known` records the current set. |
| `npm run report` | Per-tag precision from automatic agreement plus review verdicts. |
| `npm run pie` | Builds per-inspection color profiles and the canon tier table from the modern corpus, then reports how many printed cards each inspection flags. |
| `npm run pie-gate` | Estimates the wrong-flag rate per color policy from the reviewed `printed-*-pie-flags` queues and checks it against the targets in [SUCCESS.md](../SUCCESS.md). |
| `npm run pie-verdicts` | Re-inspects every reviewed pie flag and fails if a verdict changed or regressed; `-- --accept` records the baseline. |
| `npm run ast -- "Card Name"` | Prints one corpus card's parse tree as JSON, with its tags, Scryfall tags and pie flags (the data behind the review UI's `/ast` page). The name is exact and case-insensitive; on a miss it lists cards whose names contain it. Needs `data/corpus.json`. |
| `npm run ast-fixtures` | Parses the cards in `tasks/ast/fixtures/` and compares each tree with its expected structure. Fails on regressions and on `pending` markers that now pass. |
| `npm run keyword-canon` | Rebuilds `src/pie/keywordCanon.json` from the `default-cards` dump. |
| `npm run lint` | Lints src/ and tasks/. |

### Comparing corpus runs

For a before-and-after comparison, run `npm run evaluate` and `npm run pie`, then
`npm run compare-corpus -- save before`. After the change, rerun both research commands and
use `npm run compare-corpus -- compare before`. A bare name saves under
`data/baselines/<name>.json`. You can also give a relative or absolute file path. Saving
requires a new file.

Use the same corpus and Scryfall tag taxonomy for both runs. The comparison checks their
fingerprint and prediction card IDs. Rerun both producers so outputs reflect current code
and inputs. The report covers recognition, event coverage, tag assignments and evidence,
exact TP/FP/FN counts and precision and recall, pie flag decisions and evidence, profiles,
and generated canon tiers. Tag regressions include lower precision or recall, fewer true
positives, or more false positives or negatives on a previously scored tag. Flag evidence
changes are listed separately when decisions match for a card and inspection.

The report shows up to five examples per section. Add `--all` to show every changed entry.
A successful save or comparison exits 0, including when the report finds regressions.
Invalid commands, missing or incompatible files, and mismatched inputs exit 1. For held
reviews, run `npm run verdicts` and `npm run pie-verdicts` separately before and after the
change, using their default read-only modes.

Canon card colors come from mana costs, or a face's color indicator when it has no cost, so
devoid cards count in their cost's colors.

### AST fixtures

Each fixture in `tasks/ast/fixtures/` is a YAML file with a card's `name`, `typeLine` and
`text`, and an `expect` tree describing the structure the parser should produce. The card is
parsed with a default `Oracle`, independent of the corpus.

```yaml
expect:
  kind: CardText
  children:
    - kind: KeywordAbility
      pending: The ability should hold its keyword nodes directly.
      children:
        - kind: Keyword
          name: flying
        - kind: Keyword
          name: vigilance
```

`kind` must equal the node's class name; leave it out when only the properties matter. Every
other key is a node property or getter (`children`, `linkedEffects` and `resolved` included),
compared exactly; lists must have the same length. Properties not listed are ignored.
Fixtures describe the correct structure, not the current output: a `pending` reason on a node
covers mismatches in that node and below it, down to the next `pending`. Mismatches outside any
pending node fail the task, and so does a pending node that now matches, so its marker is
removed in the change that fixes it.

### Custom card review

### Scoring against intent

Scryfall's tags are the reference, but they are irregular, so `evaluate` also scores against
adjudicated gold: Scryfall's tags corrected by decisions.

- Review verdicts on the Scryfall queues settle single cards. A suggestion confirmed in
  `scryfall-suggested-not-tagged` is added; a Scryfall tag rejected in
  `scryfall-tagged-not-suggested` is removed.
- Tag policies in `tasks/tags/policies/` settle whole classes of cards. An `ExtraTagPolicy`
  explains a tag we predict that Scryfall lacks when the node that earned it matches the
  policy's query; an `OmittedTagPolicy` explains a Scryfall tag we deliberately do not predict.
  `evaluate` counts the disagreements each policy explains, and `data/predictions.json`
  records them per card under `explained`.

Each policy lists example cards, and `npm run policies` checks that they still follow it, so a
decision is a regression test as well as a scoring rule. To record a new decision, add a policy
with its examples to the registry in `tasks/tags/policies/index.js`.

The custom-card queues read Card Magician projects (`.cmproj` with YAML card files), listed by
name and folder in `reviews/projects.json`. This file is local to each checkout; copy
`reviews/projects.example.json` to start one. Without it, tasks skip custom cards. Custom cards are parsed with their project's custom
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

### Suggested mechanics for Card Magician

Run `inferMechanics(cards)` from `oracle-of-pie` on one project's cards. Supply
`{ name, faces: [{ rulesText }] }` for each card. The result contains `keywords`
and `actions` with their suggested reminders, plus a `tokens` dictionary inferred
from token cards in the same project. Include their `typeLine` and any known
`aliases` on each token face. The dictionary lets the parser link a short token
name to its card without having to infer the token's rules. Keywords also get
`reminderTypes`, mapping each reminder to where it was printed: `static` beside
the keyword itself, `granted` after a singular grant such as "target creature
gains", or `anthem` after a plural grant such as "creatures you control have".
Reminders seen only in reference entries have no type. For debugging,
`inferMechanics(cards, { includeEvidence: true })` includes supporting card counts,
examples, and keyword reminder variant counts.

A Card Magician integration can offer a **Scan set** button in project settings,
show the suggestions and let the designer accept, edit,
or dismiss each one. Run a preview with the accepted definitions before saving
them in the project. The review tasks read `customKeywords`,
`customKeywordActions`, and `customTokens` from the `.cmproj`.
For example:

```yaml
customKeywordActions:
  - name: crystallize
    reminder: Put a +1/+1 counter on a creature you control or create a Treasure token.
```

The inference API recognizes reminder-backed patterns. Parameterized mechanics
such as Fusion, custom events, or mechanics with several linked rules may need
a set-specific definition in code. Card Magician's Custom Mechanics settings run
this inference from their Autodetect button.

Verdicts are appended to `reviews/<queue>.jsonl`; the latest verdict per item wins. Pending
suggestions alternate across tags, starting with tags that have the fewest verdicts; tags with 20
or more verdicts and none wrong come last. Custom card suggestions skip tags already on the card,
and a parent tag is not suggested when a child tag you have not rejected already implies it.

## References

ReferenceResolver links each back-reference to the nearest earlier compatible phrase within one
ability (Saga chapters share a scope; quoted abilities get their own). ExileEffect.isTemporary reads
those links.

`ParsedCard.tagMatches` maps each suggested tag to the `{ node, context }` that earned it.
