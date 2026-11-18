import Node from '../core/Node.js';

export default class Expansion extends Node {
    static of(scribe, definition, node) {
        const expansion = new Expansion(scribe);
        expansion.definition = definition;
        expansion.text = definition.parse(scribe, node);
        expansion.raw = expansion.text.raw;
        expansion.isOpponents = Boolean(node.subjectIsOpponent);
        expansion.isPerformedAction = Boolean(node.isKeywordAction);
        return expansion;
    }

    get isToken() {
        return this.definition.isToken;
    }

    get children() {
        return [this.text];
    }

    childContext(context) {
        const forOpponent = Boolean(context.forOpponent || this.isOpponents);
        const origin = context.origin ?? context.sentence ?? context.ability;
        const granted = this.isToken;
        const definitionOnly = context.definitionOnly || !this.isPerformedAction;
        const expansion = this;
        return { ...context, origin, expansion, forOpponent, granted, definitionOnly };
    }

    toJSON() {
        return { node: 'Expansion', definition: this.definition.name };
    }
}
