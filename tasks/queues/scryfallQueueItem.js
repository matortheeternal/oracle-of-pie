const NOT_TAGGED = 'Suggested by the parser; Scryfall does not tag this card. '
    + 'Correct = Scryfall is missing it.';
const NOT_SUGGESTED = 'Scryfall tags this card; the parser missed it. '
    + 'Correct = Scryfall is right.';

function cardView(card) {
    const { name, rarity, faces, image, scryfall_uri } = card;
    return { name, rarity, faces, image, scryfall_uri };
}

function matchedText(prediction, tag, tree) {
    const tags = prediction?.tags ?? {};
    if (tags[tag]) return tags[tag];
    const child = Object.keys(tags).find(found => tree.ancestors(found).has(tag));
    return child ? `${tags[child]}   (implied by ${child})` : '';
}

function baseItem(card, key, tag) {
    return {
        id: `${key}|${tag}`,
        question: `Should this card be tagged “${tag}”?`,
        tag,
        card: cardView(card)
    };
}

export function notTaggedItem({ card, key, tag, prediction, tree }) {
    const matched = matchedText(prediction, tag, tree);
    return {
        ...baseItem(card, key, tag),
        evidence: [
            { label: 'Parser matched', text: matched, code: true },
            { label: 'Scryfall tag', text: tree.describe(tag) },
            { label: 'Disagreement', text: NOT_TAGGED }
        ]
    };
}

export function notSuggestedItem({ card, key, tag, tree }) {
    return {
        ...baseItem(card, key, tag),
        evidence: [
            { label: 'Scryfall tag', text: tree.describe(tag) },
            { label: 'Disagreement', text: NOT_SUGGESTED }
        ]
    };
}
