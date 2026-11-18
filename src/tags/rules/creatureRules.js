import EffectTagRule from '../EffectTagRule.js';
import TagRule from '../TagRule.js';
import KeywordAbility from '../../abilities/KeywordAbility.js';
import {
    GainLifeEffect, ModifyPTEffect, GrantEffect, TapEffect, GainControlEffect, ExileEffect
} from '../../effects/index.js';
import { isOpposingObject } from '../phrasePredicates.js';

export class LifegainRule extends TagRule {
    static get tag() { return 'lifegain'; }
    static get nodeClass() { return Object; }
    static matches(node) {
        if (node instanceof KeywordAbility)
            return node.keywords.names.includes('lifelink');
        return node instanceof GainLifeEffect && node.subjectIsYou;
    }
}

export class TapperCreatureRule extends EffectTagRule {
    static get tag() { return 'tapper-creature'; }
    static get nodeClass() { return TapEffect; }
    static testPhrase(phrase) {
        return isOpposingObject(phrase) && phrase.hasType('creature');
    }
}

export class ThreatenRule extends EffectTagRule {
    static get tag() { return 'threaten'; }
    static get nodeClass() { return GainControlEffect; }
    static test(effect, context) {
        return Boolean(effect.duration?.isUntilEndOfTurn) && super.test(effect, context);
    }
    static testPhrase(phrase) {
        return phrase.hasType('creature') || phrase.hasType('permanent');
    }
}

function pumpGrantsFlying(effect) {
    return Boolean(effect.keywords?.names.includes('flying'));
}

export class GivesFlyingRule extends TagRule {
    static get tag() { return 'gives-flying'; }
    static get nodeClass() { return Object; }
    static matches(node) {
        const grants = node instanceof GrantEffect && node.grantsKeyword('flying');
        const pumps = node instanceof ModifyPTEffect && pumpGrantsFlying(node);
        return (grants || pumps) && Boolean(node.subject) && !node.subject.refersToSelf;
    }
}

function isOwnCreatures(phrase) {
    return phrase.isMass && phrase.controlledByYou && phrase.hasType('creature');
}

export class AnthemRule extends TagRule {
    static get tag() { return 'anthem'; }
    static get nodeClass() { return ModifyPTEffect; }
    static test(effect) {
        const subject = effect.subject;
        const boostsPermanently = effect.modifier?.isPowerBoost && !effect.duration;
        return Boolean(boostsPermanently && subject && isOwnCreatures(subject));
    }
}

export class FlickerCreatureRule extends EffectTagRule {
    static get tag() { return 'flicker-creature'; }
    static get nodeClass() { return ExileEffect; }
    static test(effect, context) {
        return effect.isTemporary && super.test(effect, context);
    }
    static testPhrase(phrase) {
        return phrase.hasType('creature');
    }
}
