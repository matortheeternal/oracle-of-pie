import { printedFaceColors, printedCardColors } from '../corpus/printedColors.js';

function faceOf(face) {
    return { text: face.oracle_text ?? '', colors: printedFaceColors(face) };
}

function facesOf(card) {
    return (card.card_faces ?? [card]).map(faceOf);
}

const MAIN_TYPES = [
    'Creature', 'Instant', 'Sorcery', 'Artifact', 'Enchantment', 'Planeswalker', 'Battle',
    'Land', 'Conspiracy'
];

function mainType(card) {
    const typeLine = (card.card_faces?.[0] ?? card).type_line ?? '';
    return MAIN_TYPES.find(type => typeLine.includes(type)) ?? null;
}

export default function canonCard(card) {
    const faces = facesOf(card);
    return {
        type: mainType(card),
        faces,
        colors: printedCardColors(card.card_faces ?? [card]),
        text: faces.map(face => face.text).join('\n'),
        keywords: card.keywords ?? [],
        set: card.set
    };
}
