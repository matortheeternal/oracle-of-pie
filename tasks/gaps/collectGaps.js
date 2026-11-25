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

function site(type, owner, context) {
    return { type, owner, context };
}

function describePrevious(previous, parent) {
    const parentKind = parent.constructor.name;
    if (!previous) return site('start', parentKind, `start of ${parentKind}`);
    const path = rightmostPath(previous);
    const effect = path.find(node => node instanceof Effect);
    const leaf = path.at(-1).constructor.name;
    const owner = (effect ?? previous).constructor.name;
    return site(effect ? 'after-effect' : 'after', owner, `after ${owner} … ${leaf}`);
}

function isEffectlessSentence(node) {
    return node instanceof Sentence && !node.effects.length;
}

function describeEvent(event) {
    const owner = event.constructor.name;
    if (event.isUnsupported) return site('unsupported-event', owner, UNSUPPORTED_EVENT);
    return site('event', owner, `unread ${owner} text`);
}

function describeSite(node, children, index, parent) {
    if (parent instanceof TriggerEvent) return describeEvent(parent);
    if (isEffectlessSentence(parent))
        return site('clause', parent.constructor.name, EFFECTLESS_CLAUSE);
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
        const gapSite = describeSite(child, children, index, node);
        const context = labelled(kind, gapSite.context);
        gaps.push({ kind, raw: child.raw, context, site: gapSite, node: child });
        visit(child, gaps);
    });
}

function isFallback(gap) {
    return gap.kind === 'incomplete';
}

function visitExpansions(cardText, gaps) {
    for (const [node, { expansion }] of cardText.walk()) {
        if (!expansion || !node.isOpaque) continue;
        const owner = expansion.definition.name;
        const context = `opaque in ${owner} rules expansion`;
        const expansionSite = site('expansion', owner, context);
        gaps.push({ kind: 'opaque', raw: node.raw, context, site: expansionSite, node });
    }
}

export default function collectGaps(cardText) {
    const gaps = [];
    visit(cardText, gaps);
    const spans = gaps.filter(gap => !isFallback(gap));
    const reported = spans.length ? spans : gaps;
    visitExpansions(cardText, reported);
    return reported;
}
