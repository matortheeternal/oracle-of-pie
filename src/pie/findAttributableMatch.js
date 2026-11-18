function isAttributableMatch(inspection, node, context) {
    if (context.forOpponent || context.expansion?.isToken) return false;
    return inspection.matches(node, context);
}

export default function findAttributableMatch(face, inspection) {
    const { text, card } = face.parsed;
    for (const [node, context] of text.walk({ card }))
        if (isAttributableMatch(inspection, node, context)) return { node, context };
    return null;
}
