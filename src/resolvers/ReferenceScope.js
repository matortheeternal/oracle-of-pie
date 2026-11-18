import Effect from '../effects/Effect.js';
import Phrase from '../phrases/Phrase.js';
import QuotedAbility from '../values/QuotedAbility.js';

export default class ReferenceScope {
    static resolveAbilities(cardText) {
        let scope = null;
        let previous = null;
        for (const ability of cardText.abilities) {
            if (!scope || !ability.continuesReferenceScope(previous))
                scope = new ReferenceScope();
            scope.visit(ability, null);
            previous = ability;
        }
    }

    constructor() {
        this.candidates = [];
    }

    visit(node, effect) {
        if (node instanceof QuotedAbility)
            return ReferenceScope.resolveAbilities(node.text);
        const owner = node instanceof Effect ? node : effect;
        for (const seed of node.referenceSeeds ?? []) this.register(seed, null);
        if (node instanceof Phrase) this.register(node, owner);
        for (const child of node.children) this.visit(child, owner);
    }

    register(phrase, effect) {
        phrase.attachTo(effect);
        if (phrase.isBackReference) phrase.resolveTo(this.antecedentFor(phrase));
        if (phrase.isAntecedentCandidate) this.candidates.push(phrase);
    }

    antecedentFor(reference) {
        for (let i = this.candidates.length - 1; i >= 0; i--) {
            const candidate = this.candidates[i].resolved;
            if (candidate !== reference && reference.accepts(candidate)) return candidate;
        }
        return null;
    }
}
