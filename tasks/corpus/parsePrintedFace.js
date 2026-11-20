export default function parsePrintedFace(scribe, card, face) {
    return scribe.parseFace({
        name: face.name,
        typeLine: face.type_line ?? card.type_line ?? '',
        text: face.oracle_text ?? '',
        loyalty: face.loyalty ?? null,
        faceCount: card.faces.length,
        colors: face.colors ?? null
    });
}
