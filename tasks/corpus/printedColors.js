import { CardColors } from '../../src/index.js';

export function printedFaceColors(face) {
    if (!face.mana_cost) return face.colors ?? [];
    return CardColors.fromManaCost(face.mana_cost).colors;
}

export function printedCardColors(faces) {
    return [...new Set(faces.flatMap(printedFaceColors))];
}
