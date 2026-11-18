import EffectTagRule from '../EffectTagRule.js';
import { DamageEffect, FightEffect } from '../../effects/index.js';
import { hitsCreature, hitsPlayer } from '../phrasePredicates.js';

class BurnRule extends EffectTagRule {
    static get nodeClass() { return DamageEffect; }
}

export class BurnCreatureRule extends BurnRule {
    static get tag() { return 'burn-creature'; }
    static testPhrase(phrase) {
        return hitsCreature(phrase);
    }
}

export class BurnPlayerRule extends BurnRule {
    static get tag() { return 'burn-player'; }
    static testPhrase(phrase) {
        return hitsPlayer(phrase);
    }
}

export class BurnAnyRule extends BurnRule {
    static get tag() { return 'burn-any'; }
    static testPhrase(phrase) {
        return phrase.isAnyTarget;
    }
}

export class OneSidedFightRule extends BurnRule {
    static get tag() { return 'one-sided-fight'; }
    static test(effect, context) {
        return effect.isPowerBased && super.test(effect, context);
    }
    static testPhrase(phrase) {
        return !phrase.isAnyTarget && hitsCreature(phrase);
    }
}

export class RemovalFightRule extends EffectTagRule {
    static get tag() { return 'removal-fight'; }
    static get nodeClass() { return FightEffect; }
    static test() {
        return true;
    }
}
