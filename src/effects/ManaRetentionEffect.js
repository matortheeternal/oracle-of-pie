import Effect from './Effect.js';

const RETAINED_MANA = '(?:this|unspent(?: [a-z]+)?) mana';
const PHASES_END = 'as (?:steps(?: and phases)?|phases) end';
const MANA_RETENTION = new RegExp(`^don't lose ${RETAINED_MANA} ${PHASES_END}`, 'i');

export default class ManaRetentionEffect extends Effect {
    static get pattern() {
        return MANA_RETENTION;
    }
}
