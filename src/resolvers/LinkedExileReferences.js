import AbilityWordAbility from '../abilities/AbilityWordAbility.js';
import ExileEffect from '../effects/ExileEffect.js';
import ReturnEffect from '../effects/ReturnEffect.js';

export default class LinkedExileReferences {
    constructor() {
        this.imprinted = new Set();
    }

    record(ability) {
        if (!(ability instanceof AbilityWordAbility)) return;
        if (ability.abilityWord.toLowerCase() !== 'imprint') return;
        for (const [node, context] of ability.walk()) {
            if (context.expansion || context.granted || !(node instanceof ExileEffect))
                continue;
            for (const phrase of node.phrases) this.imprinted.add(phrase.resolved);
        }
    }

    resolve(reference) {
        if (!reference.refersToExiled || !(reference.owner instanceof ReturnEffect))
            return null;
        if (this.imprinted.size !== 1) return null;
        const [candidate] = this.imprinted;
        return reference.accepts(candidate) ? candidate : null;
    }
}
