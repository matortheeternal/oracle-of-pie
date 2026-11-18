import { TAG_RULES } from './index.js';

function evidenceOf(node, context) {
    const source = context.origin ?? context.sentence ?? context.ability;
    return source?.raw || node.raw;
}

function tagNode(found, node, context) {
    if (context.forOpponent) return;
    for (const rule of TAG_RULES) {
        if (found.has(rule.tag) || !rule.matches(node, context)) continue;
        found.set(rule.tag, evidenceOf(node, context));
    }
}

export default function tagCard(cardText, card) {
    const found = new Map();
    for (const [node, context] of cardText.walk({ card })) tagNode(found, node, context);
    return found;
}
