import Effect from '../effects/Effect.js';
import Phrase from '../phrases/Phrase.js';
import QuotedAbility from '../values/QuotedAbility.js';
import BlocksEvent from '../triggers/BlocksEvent.js';
import BecomesBlockedEvent from '../triggers/BecomesBlockedEvent.js';

function opposingCombatant(subject, object) {
    if (subject?.refersToSelf && !object?.refersToSelf && object?.hasType('creature'))
        return object;
    if (object?.refersToSelf && !subject?.refersToSelf && subject?.hasType('creature'))
        return subject;
    return null;
}

function combatCounterpart(events = []) {
    let subject = null;
    for (const event of events) {
        if (!event.sharesSubject) subject = event.subjectPhrase;
        if (!(event instanceof BlocksEvent || event instanceof BecomesBlockedEvent))
            continue;
        const counterpart = opposingCombatant(subject, event.objectPhrase);
        if (counterpart) return counterpart;
    }
    return null;
}

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
        this.counterpart = null;
    }

    visit(node, effect) {
        if (node instanceof QuotedAbility)
            return ReferenceScope.resolveAbilities(node.text);
        const owner = node instanceof Effect ? node : effect;
        for (const seed of node.referenceSeeds ?? []) this.register(seed, null);
        if (node instanceof Phrase) this.register(node, owner);
        this.visitChildren(node, owner);
    }

    visitChildren(node, owner) {
        const event = node.event;
        const previousCounterpart = this.counterpart;
        for (const child of node.children) {
            this.visit(child, owner);
            if (child === event) this.counterpart = combatCounterpart(event.alternatives);
        }
        this.counterpart = previousCounterpart;
    }

    register(phrase, effect) {
        phrase.attachTo(effect);
        if (phrase.isBackReference) phrase.resolveTo(this.antecedentFor(phrase));
        if (phrase.isAntecedentCandidate) this.candidates.push(phrase);
    }

    antecedentFor(reference) {
        for (let i = this.candidates.length - 1; i >= 0; i--) {
            const candidate = this.candidates[i].resolved;
            if (candidate === reference || !reference.accepts(candidate)) continue;
            if (candidate.refersToSelf && this.counterpart
                && reference.reference === 'that creature')
                return this.counterpart.resolved;
            return candidate;
        }
        return null;
    }
}
