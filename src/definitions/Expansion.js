import Node from '../core/Node.js';

export default class Expansion extends Node {
    static of(scribe, definition, node) {
        const expansion = new Expansion(scribe);
        expansion.definition = definition;
        expansion.text = definition.parse(scribe, node);
        expansion.raw = expansion.text.raw;
        expansion.isOpponents = Boolean(node.subjectIsOpponent);
        return expansion;
    }

    get children() {
        return [this.text];
    }

    childContext(context) {
        const forOpponent = Boolean(context.forOpponent || this.isOpponents);
        const origin = context.origin ?? context.sentence ?? context.ability;
        return { ...context, origin, expansion: this, forOpponent };
    }

    toJSON() {
        return { node: 'Expansion', definition: this.definition.name };
    }
}
