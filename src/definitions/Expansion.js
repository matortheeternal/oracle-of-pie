import Node from '../core/Node.js';

const EXPANDED_DEFINITIONS = Symbol('expandedDefinitions');

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

    *walk(context = {}) {
        const expanded = context[EXPANDED_DEFINITIONS] ?? new Set();
        if (expanded.has(this.definition)) return;
        const definitions = new Set([...expanded, this.definition]);
        yield* super.walk({ ...context, [EXPANDED_DEFINITIONS]: definitions });
    }

    get isToken() {
        return this.definition.isToken;
    }

    get children() {
        return [this.text];
    }

    repeatsReplacementToken(context) {
        const replaced = context.replacement?.replacedToken;
        return Boolean(this.isToken && replaced?.toLowerCase() === this.definition.key);
    }

    childContext(context) {
        const forOpponent = Boolean(context.forOpponent || this.isOpponents);
        const alreadyCreated = this.repeatsReplacementToken(context);
        const origin = context.origin ?? context.sentence ?? context.ability;
        const granted = this.isToken;
        const definitionOnly = context.definitionOnly || !this.isPerformedAction;
        const expansion = this;
        return {
            ...context, origin, expansion, forOpponent, granted, definitionOnly,
            alreadyCreated
        };
    }

    toJSON() {
        return { node: 'Expansion', definition: this.definition.name };
    }
}
