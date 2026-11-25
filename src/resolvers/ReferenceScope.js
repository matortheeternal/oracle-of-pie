import GrantEffect from '../effects/GrantEffect.js';
import CreateTokenEffect from '../effects/CreateTokenEffect.js';
import Effect from '../effects/Effect.js';
import EntersWithCountersEffect from '../effects/EntersWithCountersEffect.js';
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

function namesNewTokenEntering(reference, token) {
    return reference.owner instanceof EntersWithCountersEffect
        && reference.objectType === 'token' && !token.owner.copySource;
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
        if (node instanceof CreateTokenEffect && node.createdToken)
            this.register(node.createdToken, node);
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
        const antecedent = this.existingAntecedentFor(reference);
        const latest = this.candidates.at(-1);
        if (!latest?.isCreatedToken) return antecedent;
        if (namesNewTokenEntering(reference, latest)) return latest;
        return this.grantedToken(reference, latest, antecedent) ?? antecedent;
    }

    grantedToken(reference, token, antecedent) {
        const owner = reference.owner;
        if (!(owner instanceof GrantEffect) || owner.subject !== reference) return null;
        if (antecedent && !antecedent.refersToSelf) return null;
        return token.acceptsReference(reference.reference) ? token : null;
    }

    existingAntecedentFor(reference) {
        for (let i = this.candidates.length - 1; i >= 0; i--) {
            const phrase = this.candidates[i];
            const candidate = phrase.resolved;
            if (candidate.isCreatedToken || candidate === reference) continue;
            if (!reference.accepts(candidate, phrase)) continue;
            if (candidate.refersToSelf && this.counterpart
                && reference.reference === 'that creature')
                return this.counterpart.resolved;
            return candidate;
        }
        return null;
    }
}
