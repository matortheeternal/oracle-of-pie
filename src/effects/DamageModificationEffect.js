import Effect from './Effect.js';

const MODIFIED_AMOUNT_ALTERNATIVES = [
    'that much damage (?:plus|minus) \\w+',
    'double that damage',
    'twice that much damage',
    'triple that damage',
    'three times that much damage'
];
const MODIFIED_AMOUNT = MODIFIED_AMOUNT_ALTERNATIVES.join('|');
const DAMAGE_MODIFICATION = new RegExp(
    `^deals? (${MODIFIED_AMOUNT})(?: to [^,.]+?)? instead`, 'i'
);
const REDUCTION = /\bminus\b/i;

export default class DamageModificationEffect extends Effect {
    static get pattern() {
        return DAMAGE_MODIFICATION;
    }

    parseArguments(match) {
        this.modification = match[1].toLowerCase();
    }

    get increasesDamage() {
        return !REDUCTION.test(this.modification);
    }
}
