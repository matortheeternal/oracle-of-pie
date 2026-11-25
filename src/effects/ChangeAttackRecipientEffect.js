import ObjectEffect from './ObjectEffect.js';

const RETARGET_ATTACK = /^reselect which player or permanent /i;
const IS_ATTACKING = /^is attacking\b/i;

export default class ChangeAttackRecipientEffect extends ObjectEffect {
    static get pattern() {
        return RETARGET_ATTACK;
    }

    parseArguments() {
        super.parseArguments();
        this.endsInAttack = Boolean(this.consumeText(IS_ATTACKING));
    }

    get isComplete() {
        return super.isComplete && this.endsInAttack;
    }
}
