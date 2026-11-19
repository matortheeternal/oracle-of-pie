import { printedFaceColors, printedCardColors } from '../corpus/printedColors.js';

function faceOf(face) {
    return { text: face.oracle_text ?? '', colors: printedFaceColors(face) };
}

function facesOf(card) {
    return (card.card_faces ?? [card]).map(faceOf);
}

export default function canonCard(card) {
    const faces = facesOf(card);
    return {
        faces,
        colors: printedCardColors(card.card_faces ?? [card]),
        text: faces.map(face => face.text).join('\n'),
        keywords: card.keywords ?? [],
        set: card.set
    };
}
