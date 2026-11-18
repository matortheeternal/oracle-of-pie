function joinSorted(values) {
    return [...values].sort().join(', ');
}

const IMPLIES_LABEL = 'Also implies (answered by this verdict)';

function impliesEvidence(implies) {
    return implies.size ? [{ label: IMPLIES_LABEL, text: joinSorted(implies) }] : [];
}

function userTagEvidence(card) {
    if (!card.userTags.length) return [];
    return [{ label: 'Your tags', text: card.userTags.map(String).join(', ') }];
}

function unrecognizedEvidence(unrecognized) {
    if (!unrecognized.length) return [];
    const label = 'Text the parser did not recognize';
    return [{ label, text: unrecognized.join('\n'), code: true }];
}

export default function customQueueItem(suggestion) {
    const { card, tag, matched, tree, implies, unrecognized } = suggestion;
    return {
        id: `${card.id}|${tag}`,
        question: `Should this card be tagged “${tag}”?`,
        tag,
        card: card.view,
        evidence: [
            { label: 'Matched text', text: matched, code: true },
            { label: 'Scryfall tag', text: tree.describe(tag) },
            ...impliesEvidence(implies),
            ...userTagEvidence(card),
            ...unrecognizedEvidence(unrecognized)
        ]
    };
}
