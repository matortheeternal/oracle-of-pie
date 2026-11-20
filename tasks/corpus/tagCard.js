import eventCoverage from './eventCoverage.js';
import parsePrintedFace from './parsePrintedFace.js';

function mergeTags(faces) {
    const tags = {};
    for (const face of faces)
        for (const [tag, evidence] of face.tags) tags[tag] ??= evidence;
    return tags;
}

export default function tagCard(scribe, card) {
    const faces = card.faces.map(face => parsePrintedFace(scribe, card, face));
    return {
        tags: mergeTags(faces),
        recognized: faces.every(face => face.isFullyRecognized),
        unrecognized: faces.flatMap(face => face.unrecognized),
        opaque: faces.flatMap(face => face.opaque).length,
        events: eventCoverage(faces)
    };
}
