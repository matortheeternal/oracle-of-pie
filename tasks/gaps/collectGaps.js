import Effect from '../../src/effects/Effect.js';
import Clause from '../../src/clauses/Clause.js';

const EFFECTLESS_CLAUSE = 'clause with no recognized effect';

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

function isEmptyClause(node) {
    return node instanceof Clause && !node.effect;
}

function describeContext(node, children, index, parent) {
    const previous = children[index - 1];
    if (node instanceof Clause || isEmptyClause(previous)) return EFFECTLESS_CLAUSE;
    return describePrevious(previous, parent);
}

function gapKind(node) {
    if (node.isUnrecognizedSpan) return 'unrecognized';
    return node.isOpaque ? 'opaque' : null;
}

function visit(node, gaps) {
    const children = node.children;
    children.forEach((child, index) => {
        const kind = gapKind(child);
        if (!kind) return visit(child, gaps);
        const context = describeContext(child, children, index, node);
        gaps.push({ kind, raw: child.raw, context });
        visit(child, gaps);
    });
}

export default function collectGaps(cardText) {
    const gaps = [];
    visit(cardText, gaps);
    return gaps;
}
