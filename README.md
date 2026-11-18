# rules-scribe

Parser for Magic rules text that builds a semantic tree and suggests Scryfall oracle tags.
Structured after sigil-sifter and mana-scribe: node classes with `static match` / `static parse`,
ordered strategy registries, and nodes that consume `remainingStr`.

Levels: CardText → abilities/ → statements/ (Sentence, statement registry) → clauses/ → effects/ →
phrases/ (+ modifiers/) → values/; costs/ use mana-scribe. resolvers/ link across sentences
(temporary exile). tags/ holds TagRule strategies that read the tree.

    node bin/tagCorpus.js ../data/corpus.json ../data/js-predictions.json
    ../.venv/bin/python -I ../spike/tageval.py ../spike ../data/corpus.json ../data/tags.json ../data/tageval-js.json ../data/js-predictions.json

Status (2026-11-17, modern corpus): 67% of cards fully recognized; tag micro precision 98.4%, recall 78.3%
(Python spike: 56%, 97.6%, 71.9%).

Definitions: keywords, keyword actions and tokens are all a name plus reminder text. Matching nodes
(KeywordAbility, KeywordActionEffect, CreateTokenEffect) attach the parsed reminder as an Expansion; tag rules
see expansions, recognition coverage ignores them. Projects add or override definitions by name:

    new RulesScribe({ definitions: {
        keywords: [{ name: 'Siphon', reminder: 'Whenever this creature attacks, each opponent loses {parameter} life.' },
                   { name: 'Typecycling', pattern: /(?<type>[a-z]+)cycling/, reminder: '... a {type} card ...' }],
        actions: [{ name: 'Investigate', reminder: 'Create a Clue token.' }],
        tokens: [{ name: 'Lantern', typeLine: 'Token Artifact — Lantern', reminder: '{1}, Sacrifice this token: Scry 2.' }]
    } });

References: ReferenceResolver links each back-reference to the nearest earlier compatible phrase within one
ability (Saga chapters share a scope; quoted abilities get their own). ExileEffect.isTemporary reads those links.
Next: "each of up to N target", "divided among N targets", "named <card>"; split multi-node-type tag rules
into one rule class per node type; jasmine tests from review verdicts; port custom-card queue to JS.
