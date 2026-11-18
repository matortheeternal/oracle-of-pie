import TagRule from '../TagRule.js';
import EffectTagRule from '../EffectTagRule.js';
import Sentence from '../../statements/Sentence.js';
import ActivatedAbility from '../../abilities/ActivatedAbility.js';
import {
    DrawEffect, DiscardEffect, MillEffect, KeywordActionEffect
} from '../../effects/index.js';

function indexOfType(effects, type) {
    return effects.findIndex(effect => effect instanceof type);
}

export class DrawRule extends EffectTagRule {
    static get tag() { return 'draw'; }
    static get nodeClass() { return DrawEffect; }
    static test() {
        return true;
    }
}

export class DiscardRule extends EffectTagRule {
    static get tag() { return 'discard'; }
    static get nodeClass() { return DiscardEffect; }
    static test(effect) {
        return effect.subjectIsOpponent;
    }
}

export class MillOpponentRule extends EffectTagRule {
    static get tag() { return 'mill-opponent'; }
    static get nodeClass() { return MillEffect; }
    static test(effect) {
        return effect.subjectIsOpponent;
    }
}

export class ScryRule extends EffectTagRule {
    static get tag() { return 'scry'; }
    static get nodeClass() { return KeywordActionEffect; }
    static test(effect) {
        return effect.action === 'scry';
    }
}

export class LootRule extends TagRule {
    static get tag() { return 'loot'; }
    static get nodeClass() { return Sentence; }
    static test(sentence) {
        const draw = indexOfType(sentence.effects, DrawEffect);
        const discard = indexOfType(sentence.effects, DiscardEffect);
        const discardsOwnCards = !sentence.effects[discard]?.subjectIsOpponent;
        return draw >= 0 && discard > draw && discardsOwnCards;
    }
}

function drawsCard(body) {
    return indexOfType(body.effects, DrawEffect) >= 0;
}

function isRummageDiscard(discard) {
    return !discard.subjectIsOpponent && !discard.discardsHand;
}

export class RummageRule extends TagRule {
    static get tag() { return 'rummage'; }
    static get nodeClass() { return Object; }
    static matches(node) {
        if (node instanceof ActivatedAbility)
            return node.cost.discardsOtherCards && drawsCard(node.body);
        if (!(node instanceof Sentence)) return false;
        const discard = indexOfType(node.effects, DiscardEffect);
        const draw = indexOfType(node.effects, DrawEffect);
        return discard >= 0 && draw > discard && isRummageDiscard(node.effects[discard]);
    }
}
