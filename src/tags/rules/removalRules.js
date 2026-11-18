import EffectTagRule from '../EffectTagRule.js';
import {
    DestroyEffect, ExileEffect, ReturnEffect, CounterEffect, SacrificeEffect,
    ModifyPTEffect, PutCountersEffect, DamageEffect
} from '../../effects/index.js';
import {
    isOpposingObject, isRemovalTarget, requiresFlying
} from '../phrasePredicates.js';

const REMOVAL_EFFECTS = [DestroyEffect, ExileEffect, ReturnEffect];

function isBounce(effect) {
    return effect.destination === 'hand' && !effect.fromGraveyard;
}

function isRemovalEffect(node) {
    return REMOVAL_EFFECTS.some(type => node instanceof type) && isPermanentRemoval(node);
}

function isPermanentRemoval(effect) {
    if (effect instanceof ExileEffect) return !effect.isTemporary;
    if (effect instanceof ReturnEffect) return isBounce(effect);
    return effect instanceof DestroyEffect;
}

export class CounterspellRule extends EffectTagRule {
    static get tag() { return 'counterspell'; }
    static get nodeClass() { return CounterEffect; }
    static test(effect) {
        return effect.countersSpell;
    }
}

export class RemovalDestroyRule extends EffectTagRule {
    static get tag() { return 'removal-destroy'; }
    static get nodeClass() { return DestroyEffect; }
    static testPhrase(phrase) {
        return isOpposingObject(phrase);
    }
}

export class RemovalExileRule extends EffectTagRule {
    static get tag() { return 'removal-exile'; }
    static get nodeClass() { return ExileEffect; }
    static test(effect, context) {
        return !effect.isTemporary && super.test(effect, context);
    }
    static testPhrase(phrase) {
        return isOpposingObject(phrase)
            && !phrase.isBackReference
            && phrase.isPermanentObject;
    }
}

export class ExileSpellRule extends EffectTagRule {
    static get tag() { return 'counterspell'; }
    static get nodeClass() { return ExileEffect; }
    static testPhrase(phrase) {
        return Boolean(phrase.hasExactType?.('spell')) && !phrase.controlledByYou;
    }
}

export class RemovalBounceRule extends EffectTagRule {
    static get tag() { return 'removal-bounce'; }
    static get nodeClass() { return ReturnEffect; }
    static test(effect, context) {
        return isBounce(effect) && super.test(effect, context);
    }
    static testPhrase(phrase) {
        return isOpposingObject(phrase) && !phrase.isBackReference;
    }
}

class TypedRemovalRule extends EffectTagRule {
    static get nodeClass() { return Object; }
    static matches(node, context) {
        return isRemovalEffect(node) && this.test(node, context);
    }
}

export class RemovalArtifactRule extends TypedRemovalRule {
    static get tag() { return 'removal-artifact'; }
    static testPhrase(phrase) {
        return isRemovalTarget(phrase, 'artifact');
    }
}

export class RemovalEnchantmentRule extends TypedRemovalRule {
    static get tag() { return 'removal-enchantment'; }
    static testPhrase(phrase) {
        return isRemovalTarget(phrase, 'enchantment');
    }
}

export class HateFlyingRule extends EffectTagRule {
    static get tag() { return 'hate-flying'; }
    static get nodeClass() { return Object; }
    static matches(node, context) {
        const types = [...REMOVAL_EFFECTS, DamageEffect, ModifyPTEffect];
        return types.some(type => node instanceof type) && this.test(node, context);
    }
    static testPhrase(phrase) {
        return requiresFlying(phrase) && !phrase.controlledByYou;
    }
}

export class RemovalSacrificeRule extends EffectTagRule {
    static get tag() { return 'removal-sacrifice'; }
    static get nodeClass() { return SacrificeEffect; }
    static test(effect) {
        return effect.subjectIsOpponent;
    }
}

export class RemovalToughnessRule extends EffectTagRule {
    static get tag() { return 'removal-toughness'; }
    static get nodeClass() { return Object; }
    static matches(node, context) {
        if (node instanceof ModifyPTEffect)
            return Boolean(node.modifier?.lowersToughness) && this.testSubject(node);
        return node instanceof PutCountersEffect
            && node.isMinusCounters
            && this.test(node, context);
    }
    static testSubject(effect) {
        const subject = effect.subject;
        if (!subject) return false;
        return isOpposingObject(subject) && subject.hasType('creature');
    }
    static testPhrase(phrase) {
        return isOpposingObject(phrase) && phrase.hasType('creature');
    }
}

export class SweeperRule extends EffectTagRule {
    static get tag() { return 'sweeper'; }
    static get nodeClass() { return Object; }
    static matches(node, context) {
        if (node instanceof ModifyPTEffect) return this.weakensMass(node);
        if (node instanceof SacrificeEffect) return this.forcesMassSacrifice(node);
        if (node instanceof DamageEffect)
            return node.phrases.some(phrase => this.isMassCreatures(phrase));
        return isRemovalEffect(node) && this.test(node, context);
    }
    static weakensMass(effect) {
        const lowers = Boolean(effect.modifier?.lowersToughness);
        return lowers && this.isMassOpposing(effect.subject);
    }
    static forcesMassSacrifice(effect) {
        const eachPlayer = effect.subject?.player === 'each player';
        return eachPlayer && this.isMassOpposing(effect.phrases[0]);
    }
    static isMassCreatures(phrase) {
        return phrase.isMass && phrase.hasType('creature') && !phrase.controlledByYou;
    }
    static isMassOpposing(phrase) {
        return Boolean(phrase?.isMass) && !phrase.controlledByYou && !phrase.isCardInZone;
    }
    static testPhrase(phrase) {
        return this.isMassOpposing(phrase);
    }
}
