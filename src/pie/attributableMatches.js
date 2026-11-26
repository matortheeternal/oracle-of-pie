function isAttributableMatch(inspection, node, context) {
    if (context.forOpponent || context.definitionOnly) return false;
    return inspection.matches(node, context);
}

export default function* attributableMatches(face, inspection) {
    for (const [node, context] of face.parsed.walked)
        if (isAttributableMatch(inspection, node, context)) yield { node, context };
}
