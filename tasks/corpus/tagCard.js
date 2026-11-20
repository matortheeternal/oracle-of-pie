import eventCoverage from './eventCoverage.js';

function parseFace(scribe, card, face) {
    return scribe.parseFace({
        name: face.name,
        typeLine: face.type_line ?? card.type_line ?? '',
        text: face.oracle_text ?? '',
        loyalty: face.loyalty ?? null,
        faceCount: card.faces.length
    });
}

function mergeTags(faces) {
    const tags = {};
    for (const face of faces)
        for (const [tag, evidence] of face.tags) tags[tag] ??= evidence;
    return tags;
}

export default function tagCard(scribe, card) {
    const faces = card.faces.map(face => parseFace(scribe, card, face));
    return {
        tags: mergeTags(faces),
        recognized: faces.every(face => face.isFullyRecognized),
        unrecognized: faces.flatMap(face => face.unrecognized),
        opaque: faces.flatMap(face => face.opaque).length,
        events: eventCoverage(faces)
    };
}
