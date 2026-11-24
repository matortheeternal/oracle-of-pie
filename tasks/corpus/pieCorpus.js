import { CardColors } from '../../src/index.js';
import { printedCardColors } from './printedColors.js';
import parsePrintedFace from './parsePrintedFace.js';

export function cardColorsOf(card) {
    const colors = printedCardColors(card.faces);
    return new CardColors({ colors, manaCost: card.mana_cost ?? '' });
}

function faceColorsOf(card, face) {
    if (card.faces.length < 2 || !face.mana_cost) return cardColorsOf(card);
    return CardColors.fromManaCost(face.mana_cost);
}

function parseFace(scribe, card, face) {
    const parsed = parsePrintedFace(scribe, card, face);
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
