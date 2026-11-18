function isAttributableMatch(inspection, node, context) {
    if (context.forOpponent || context.expansion) return false;
    return inspection.matches(node, context);
}

export default function findAttributableMatch(face, inspection) {
    for (const [node, context] of face.parsed.walk())
        if (isAttributableMatch(inspection, node, context)) return { node, context };
    return null;
}
