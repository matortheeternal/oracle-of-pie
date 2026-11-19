import explainDisagreements from '../tags/policies/explainDisagreements.js';

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

function explanationsFor(faces, tags, gold) {
    if (!gold) return {};
    return explainDisagreements(faces, Object.keys(tags), gold);
}

export default function tagCard(scribe, card, gold = null) {
    const faces = card.faces.map(face => parseFace(scribe, card, face));
    const tags = mergeTags(faces);
    return {
        tags,
        explained: explanationsFor(faces, tags, gold),
        recognized: faces.every(face => face.isFullyRecognized),
        unrecognized: faces.flatMap(face => face.unrecognized),
        opaque: faces.flatMap(face => face.opaque).length
    };
}
