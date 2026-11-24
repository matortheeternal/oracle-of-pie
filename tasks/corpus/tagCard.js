import explainDisagreements from '../tags/policies/explainDisagreements.js';
import eventCoverage from './eventCoverage.js';
import parsePrintedFace from './parsePrintedFace.js';

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
    const faces = card.faces.map(face => parsePrintedFace(scribe, card, face));
    const tags = mergeTags(faces);
    return {
        tags,
        explained: explanationsFor(faces, tags, gold),
        recognized: faces.every(face => face.isFullyRecognized),
        modeled: faces.every(face => face.isFullyModeled),
        unrecognized: faces.flatMap(face => face.unrecognized),
        opaque: faces.flatMap(face => face.opaque).length,
        events: eventCoverage(faces)
    };
}
