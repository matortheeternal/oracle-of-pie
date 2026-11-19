function faceOf(face, card) {
    return { text: face.oracle_text ?? '', colors: face.colors ?? card.colors ?? [] };
}

function facesOf(card) {
    if (!card.card_faces) return [faceOf(card, card)];
    return card.card_faces.map(face => faceOf(face, card));
}

export default function canonCard(card) {
    const faces = facesOf(card);
    const colors = card.colors ?? [...new Set(faces.flatMap(face => face.colors))];
    return {
        faces,
        colors,
        identity: card.color_identity ?? [],
        text: faces.map(face => face.text).join('\n'),
        keywords: card.keywords ?? [],
        set: card.set
    };
}
