import nodeProperties from './nodeProperties.js';

const BASE_CLASS = 'Node';

function lineageOf(node) {
    const names = [];
    let current = Object.getPrototypeOf(node);
    while (current && current.constructor.name !== BASE_CLASS) {
        names.push(current.constructor.name);
        current = Object.getPrototypeOf(current);
    }
    return names;
}

const ROLES = { child: 'child', expansion: 'expansion', seed: 'reference seed' };

function childNodes(node) {
    return [
        ...(node.referenceSeeds ?? []).map(seed => [seed, ROLES.seed]),
        ...node.children.map(child => [child, ROLES.child]),
        ...node.expansions.map(expansion => [expansion, ROLES.expansion])
    ];
}

export default class AstSerializer {
    constructor(annotations = new Map()) {
        this.annotations = annotations;
        this.ids = new Map();
    }

    assignIds(node) {
        if (!this.ids.has(node)) this.ids.set(node, this.ids.size);
        for (const [child] of childNodes(node)) this.assignIds(child);
    }

    serialize(root) {
        this.assignIds(root);
        return this.serializeNode(root, ROLES.child);
    }

    serializeChildren(node) {
        return childNodes(node).map(([child, role]) => this.serializeNode(child, role));
    }

    serializeNode(node, role) {
        return {
            id: this.ids.get(node),
            kind: node.constructor.name,
            lineage: lineageOf(node),
            raw: node.raw,
            isRecognized: node.isRecognized,
            isOpaque: Boolean(node.isOpaque),
            role,
            annotations: this.annotations.get(node) ?? null,
            properties: nodeProperties(node, this.ids),
            children: this.serializeChildren(node)
        };
    }
}
