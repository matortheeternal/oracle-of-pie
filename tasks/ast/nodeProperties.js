import Node from 'oracle-of-pie/src/core/Node.js';

const HIDDEN = new Set([
    'children', 'expansions', 'parts', 'leftover', 'raw', 'remainingStr', 'constructor',
    'scribe', 'referenceSeeds'
]);
const CACHED_FIELD = /^cached/;
const GETTERS_BY_CLASS = new WeakMap();

function prototypeChain(prototype) {
    const chain = [];
    let current = prototype;
    while (current !== Object.prototype) {
        chain.push(current);
        current = Object.getPrototypeOf(current);
    }
    return chain;
}

function ownGetterNames(prototype) {
    const descriptors = Object.entries(Object.getOwnPropertyDescriptors(prototype));
    return descriptors.filter(([name, descriptor]) => descriptor.get && !HIDDEN.has(name))
        .map(([name]) => name);
}

function collectGetterNames(prototype) {
    return [...new Set(prototypeChain(prototype).flatMap(ownGetterNames))].sort();
}

function getterNames(node) {
    const prototype = Object.getPrototypeOf(node);
    if (!GETTERS_BY_CLASS.has(prototype))
        GETTERS_BY_CLASS.set(prototype, collectGetterNames(prototype));
    return GETTERS_BY_CLASS.get(prototype);
}

function isPrimitive(value) {
    return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function describeNode(node, ids) {
    return { ref: ids.get(node) ?? null, kind: node.constructor.name, raw: node.raw };
}

function describeArray(values, ids) {
    if (values.every(isPrimitive)) return values;
    if (values.every(value => value instanceof Node))
        return values.map(value => describeNode(value, ids));
    return undefined;
}

function describeObject(value) {
    if (typeof value.toJSON === 'function') return value.toJSON();
    const entries = Object.entries(value);
    return entries.every(([, entry]) => isPrimitive(entry)) ? value : undefined;
}

export function describeValue(value, ids) {
    if (value === undefined || typeof value === 'function') return undefined;
    if (isPrimitive(value)) return value;
    if (value instanceof Node) return describeNode(value, ids);
    if (Array.isArray(value)) return describeArray(value, ids);
    return describeObject(value);
}

function readGetter(node, name) {
    try {
        return node[name];
    } catch {
        return undefined;
    }
}

function ownFieldNames(node) {
    const names = Object.getOwnPropertyNames(node);
    return names.filter(name => !HIDDEN.has(name) && !CACHED_FIELD.test(name));
}

export default function nodeProperties(node, ids) {
    const properties = {};
    for (const name of [...ownFieldNames(node), ...getterNames(node)]) {
        const value = describeValue(readGetter(node, name), ids);
        if (value !== undefined) properties[name] = value;
    }
    return properties;
}
