function matchingIds(candidates, node, context, idOf) {
    return candidates.filter(candidate => candidate.matches(node, context)).map(idOf);
}

function annotationFor(annotations, node) {
    if (!annotations.has(node)) annotations.set(node, { tags: [], inspections: [] });
    return annotations.get(node);
}

function addUnique(target, values) {
    for (const value of values) if (!target.includes(value)) target.push(value);
}

export default function annotateFace(parsed, inspections) {
    const annotations = new Map();
    const evaluators = parsed.tagLibrary.evaluators;
    for (const [node, context] of parsed.walk()) {
        const tags = matchingIds(evaluators, node, context, evaluator => evaluator.tag);
        const pie = matchingIds(inspections, node, context, inspection => inspection.id);
        if (!tags.length && !pie.length && !context.forOpponent) continue;
        const annotation = annotationFor(annotations, node);
        addUnique(annotation.tags, tags);
        addUnique(annotation.inspections, pie);
        annotation.forOpponent = Boolean(context.forOpponent);
    }
    return annotations;
}
