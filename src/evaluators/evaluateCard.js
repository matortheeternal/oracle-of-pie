import evidenceOf from './evidenceOf.js';

function evaluateNode(found, evaluators, node, context) {
    if (context.forOpponent) return;
    for (const evaluator of evaluators) {
        if (found.has(evaluator.tag) || !evaluator.matches(node, context)) continue;
        found.set(evaluator.tag, evidenceOf(node, context));
    }
}

export default function evaluateCard(parsedCard) {
    const found = new Map();
    const evaluators = parsedCard.tagLibrary.evaluators;
    for (const [node, context] of parsedCard.walk())
        evaluateNode(found, evaluators, node, context);
    return found;
}
