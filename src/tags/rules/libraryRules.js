import EffectTagRule from '../EffectTagRule.js';
import TagRule from '../TagRule.js';
import {
    SearchLibraryEffect, ReturnEffect, PutEffect, OpaqueEffect
} from '../../effects/index.js';

const ADDITIONAL_LAND = /^(?:you may )?play an additional land/i;

export class TutorToHandRule extends EffectTagRule {
    static get tag() { return 'tutor-to-hand'; }
    static get nodeClass() { return SearchLibraryEffect; }
    static test(effect) {
        return effect.toHand;
    }
}

export class FetchlandRule extends EffectTagRule {
    static get tag() { return 'fetchland'; }
    static get nodeClass() { return SearchLibraryEffect; }
    static test(effect, context) {
        return context.card.isLand && effect.findsLand && effect.toBattlefield;
    }
}

function isLandCardInHand(phrase) {
    return phrase.hasExactType?.('land') && phrase.zone === 'hand';
}

export class LandRampRule extends TagRule {
    static get tag() { return 'land-ramp'; }
    static get nodeClass() { return Object; }
    static matches(node, context) {
        if (node instanceof SearchLibraryEffect)
            return !context.card.isLand && node.findsLand && node.toBattlefield;
        if (node instanceof PutEffect)
            return node.toBattlefield && node.phrases.some(isLandCardInHand);
        return node instanceof OpaqueEffect && ADDITIONAL_LAND.test(node.text);
    }
}

function isCreatureCard(phrase) {
    return phrase.hasExactType?.('creature') && phrase.isCardInZone;
}

function isCreatureCardInGraveyard(phrase) {
    return isCreatureCard(phrase) && phrase.zone === 'graveyard';
}

function reanimatesCreature(effect) {
    if (effect.destination !== 'battlefield' || !effect.fromGraveyard) return false;
    return effect.phrases.some(isCreatureCard);
}

export class ReanimateCreatureRule extends TagRule {
    static get tag() { return 'reanimate-creature'; }
    static get nodeClass() { return Object; }
    static matches(node) {
        if (node instanceof ReturnEffect) return reanimatesCreature(node);
        return node instanceof PutEffect
            && node.toBattlefield
            && node.phrases.some(isCreatureCardInGraveyard);
    }
}

export class RegrowthCreatureRule extends EffectTagRule {
    static get tag() { return 'regrowth-creature'; }
    static get nodeClass() { return ReturnEffect; }
    static test(effect, context) {
        const regrows = effect.destination === 'hand' && effect.fromGraveyard;
        return regrows && super.test(effect, context);
    }
    static testPhrase(phrase) {
        return isCreatureCard(phrase);
    }
}
