function evidenceOf(node, context) {
    const source = context.origin ?? context.sentence ?? context.ability;
    return source?.raw || node.raw;
}

function evaluateNode(found, evaluators, node, context) {
    if (context.forOpponent) return;
    for (const evaluator of evaluators) {
        if (found.has(evaluator.tag) || !evaluator.matches(node, context)) continue;
        found.set(evaluator.tag, evidenceOf(node, context));
    }
}

export default function evaluateCard(cardText, card, evaluators) {
    const found = new Map();
    for (const [node, context] of cardText.walk({ card }))
        evaluateNode(found, evaluators, node, context);
    return found;
}
