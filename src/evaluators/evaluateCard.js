import evidenceOf from './evidenceOf.js';

function record(found, tags, node, context) {
    for (const tag of tags)
        if (!found.has(tag)) found.set(tag, evidenceOf(node, context));
}

function evaluateNode(found, evaluators, node, context) {
    if (context.forOpponent) return;
    for (const evaluator of evaluators) {
        if (found.has(evaluator.tag)) continue;
        record(found, evaluator.tagsFor(node, context), node, context);
    }
}

export default function evaluateCard(parsedCard) {
    const found = new Map();
    const evaluators = parsedCard.tagLibrary.evaluators;
    for (const [node, context] of parsedCard.walk())
        evaluateNode(found, evaluators, node, context);
    return found;
}
