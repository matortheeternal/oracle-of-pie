# oracle-of-pie

A JavaScript library for building Magic: The Gathering card-design tools. It parses Oracle
text into a semantic tree, then uses that tree to suggest Scryfall tags and flag possible
color-pie bends and breaks. Suggestions and flags cite the card text that triggered them.
Color-pie flags cite the applicable policy and include printed examples when available.

## Quick start

From this checkout, run `npm install`. The library can read printed and custom cards.
Use `isFullyRecognized` to check whether the parser understood the whole face.

```js
import { Oracle, PieInspector, CardColors } from 'oracle-of-pie';

const parsed = new Oracle().parseFace({
    name: 'Sudden Downpour',
    typeLine: 'Instant',
    text: 'Destroy target creature with flying. You gain 2 life.'
});

const tags = parsed.tags;
const fullyRecognized = parsed.isFullyRecognized;
const colors = CardColors.fromManaCost('{1}{U}');
const flags = new PieInspector().inspect([{ parsed, colors }]);
```

Configure custom keywords and token definitions, supply tag queries, or customize
inspections in the [project reference](docs/reference.md).

For sources that wrap rules text mid-sentence, create an instance with
`new Oracle({ repairLineWraps: true })`. Repair is off by default and applies to
`parseText` and `parseFace` when enabled. Importers can also call
`prepareText(text)` to apply the option while retaining the original text.

## Corpus results

On the November 2026 corpus of 17,836 modern cards, **80.3%** were fully recognized
(14,327 cards).

- [Scryfall tag coverage](docs/tag-coverage.md)
- [Color-pie inspections and exceptions](docs/pie-inspections.md)

## Development

- `npm run ast -- "Card Name"` inspects a card's parse tree.
- `npm run evaluate` measures tag precision, recall, and parser recognition.
- `npm run pie` builds canon profiles and runs color-pie inspections.
- `npm run lint` and `npm run ast-fixtures` check code and parser behavior.

See the [project reference](docs/reference.md#development) for corpus setup, review
workflows, and the full command list.
