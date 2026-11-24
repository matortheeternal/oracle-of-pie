import Node from '../../../src/core/Node.js';

function describeNode(node) {
    return `${node.constructor.name} "${node.raw}"`;
}

function describeList(values) {
    return `[${values.map(describeValue).join(', ')}]`;
}

export default function describeValue(value) {
    if (value instanceof Node) return describeNode(value);
    if (Array.isArray(value)) return describeList(value);
    return JSON.stringify(value) ?? String(value);
}
