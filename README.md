# oracle-of-pie

Reads Magic Oracle text into a semantic tree, suggests Scryfall oracle tags, and inspects cards for
color pie breaks. Card Magician uses it for tag suggestions and color pie inspections; the research
harness that measures it against Scryfall lives in cm-autotag.

Structured after sigil-sifter and mana-scribe: node classes with `static match` / `static parse`,
ordered strategy registries, and nodes that consume `remainingStr`.

Levels: CardText → abilities/ → statements/ (Sentence, statement registry) → clauses/ → effects/ →
phrases/ (+ modifiers/) → values/; costs/ use mana-scribe. resolvers/ link across sentences
(back-references). evaluators/ runs declarative queries over the tree; tags/ holds the tag queries;
pie/ holds the color pie inspections.

Evaluate against Scryfall tags from cm-autotag with `npm run evaluate`.

Status (2026-11-18, modern corpus): 82.1% of cards fully recognized; tag micro precision 98.3%,
recall 78.9%.

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
  phrases. Defaults to `DEFAULT_KEYWORDS`; pass the full list to replace it.
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
  the last: canon frequency (pie/canonTierTable.js, generated by cm-autotag's `npm run pie`), the
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

`keywordInspections({ climbing: tiers })` builds keyword inspections from a project's own tiers.

## References

ReferenceResolver links each back-reference to the nearest earlier compatible phrase within one
ability (Saga chapters share a scope; quoted abilities get their own). ExileEffect.isTemporary reads
those links.
