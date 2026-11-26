import ObjectEffect from './ObjectEffect.js';

const RETARGET_ATTACK = /^reselect which player(?: or permanent)? /i;
const IS_ATTACKING = /^is attacking\b/i;
const SET_ATTACK_RECIPIENT = /^(?:(?:is|are) |'s )(?:now )?attacking /i;

export default class ChangeAttackRecipientEffect extends ObjectEffect {
    static get pattern() {
        return RETARGET_ATTACK;
    }

    static match(scribe, str) {
        return str.match(SET_ATTACK_RECIPIENT) ?? super.match(scribe, str);
    }

    parseArguments(match) {
        super.parseArguments();
        this.endsInAttack = SET_ATTACK_RECIPIENT.test(match[0])
            || Boolean(this.consumeText(IS_ATTACKING));
    }

    get isComplete() {
        return super.isComplete && this.endsInAttack;
    }
}
