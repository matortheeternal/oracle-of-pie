import { CardColors } from '../../src/index.js';

export function cardColorsOf(card) {
    return new CardColors({ colors: card.colors ?? [], manaCost: card.mana_cost ?? '' });
}

function faceColorsOf(card, face) {
    if (card.faces.length < 2 || !face.mana_cost) return cardColorsOf(card);
    return CardColors.fromManaCost(face.mana_cost);
}

function parseFace(scribe, card, face) {
    const parsed = scribe.parseFace({
        name: face.name,
        typeLine: face.type_line ?? card.type_line ?? '',
        text: face.oracle_text ?? ''
    });
    return { parsed, colors: faceColorsOf(card, face) };
}

export function parseCardFaces(scribe, card) {
    return card.faces.map(face => parseFace(scribe, card, face));
}

export function* pieCards(scribe, corpus) {
    for (const card of corpus) {
        try {
            const faces = parseCardFaces(scribe, card);
            yield { card, faces, colors: cardColorsOf(card) };
        } catch (error) {
            console.warn('skipped', card.name, error.message);
        }
    }
}
