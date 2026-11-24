import Effect from '../../src/effects/Effect.js';
import Sentence from '../../src/sentences/Sentence.js';
import TriggerEvent from '../../src/triggers/TriggerEvent.js';

const EFFECTLESS_CLAUSE = 'clause with no recognized effect';
const UNSUPPORTED_EVENT = 'unsupported trigger event';

function rightmostPath(node) {
    const path = [node];
    let current = node;
    while (current.children.length) {
        current = current.children.at(-1);
        path.push(current);
    }
    return path;
}

function describePrevious(previous, parent) {
    if (!previous) return `start of ${parent.constructor.name}`;
    const path = rightmostPath(previous);
    const effect = path.find(node => node instanceof Effect);
    const leaf = path.at(-1).constructor.name;
    if (!effect) return `after ${previous.constructor.name} … ${leaf}`;
    return `after ${effect.constructor.name} … ${leaf}`;
}

function isEffectlessSentence(node) {
    return node instanceof Sentence && !node.effects.length;
}

function describeEvent(event) {
    const unread = `unread ${event.constructor.name} text`;
    return event.isUnsupported ? UNSUPPORTED_EVENT : unread;
}

function describeContext(node, children, index, parent) {
    if (parent instanceof TriggerEvent) return describeEvent(parent);
    if (isEffectlessSentence(parent)) return EFFECTLESS_CLAUSE;
    return describePrevious(children[index - 1], parent);
}

function isIncomplete(node) {
    return !node.isRecognized && node.children.every(child => child.isRecognized);
}

function gapKind(node) {
    if (node.isUnrecognizedSpan) return 'unrecognized';
    if (node.isOpaque) return 'opaque';
    return isIncomplete(node) ? 'incomplete' : null;
}

function labelled(kind, context) {
    return kind === 'unrecognized' ? context : `${kind}, ${context}`;
}

function visit(node, gaps) {
    const children = node.children;
    children.forEach((child, index) => {
        const kind = gapKind(child);
        if (!kind) return visit(child, gaps);
        const context = describeContext(child, children, index, node);
        gaps.push({ kind, raw: child.raw, context: labelled(kind, context) });
        visit(child, gaps);
    });
}

function isFallback(gap) {
    return gap.kind === 'incomplete';
}

export default function collectGaps(cardText) {
    const gaps = [];
    visit(cardText, gaps);
    const spans = gaps.filter(gap => !isFallback(gap));
    return spans.length ? spans : gaps;
}
