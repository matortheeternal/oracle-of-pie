import Parser from '../core/Parser.js';
import EffectSequence from '../sentences/EffectSequence.js';
import UnrecognizedText from '../values/UnrecognizedText.js';

const ONLY_ONCE = /\bonly once\b(?! each)/i;

export default class Ability extends Parser {
    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.modes = [];
        this.reminders = [];
    }

    parseBody(text) {
        return EffectSequence.fromText(this.scribe, text);
    }

    addMode(mode) {
        this.modes.push(mode);
    }

    get isKeywordOnly() {
        return false;
    }

    get reminderLimitsToOnce() {
        return this.reminders.some(reminder => ONLY_ONCE.test(reminder));
    }

    get parts() {
        return [];
    }

    get leftover() {
        return UnrecognizedText.fromLeftover(this.scribe, this.remainingStr);
    }

    continuesReferenceScope(previous) {
        return false;
    }

    get children() {
        return [...this.parts, ...this.modes, this.leftover].filter(Boolean);
    }

    get isKeywordAbility() {
        return false;
    }

    get isRepeatable() {
        return false;
    }

    get referenceSeeds() {
        return [];
    }

    get hasAdditionalCost() {
        return false;
    }

    get isModal() {
        return this.modes.length > 1;
    }

    childContext(context) {
        const abilities = [...(context.abilities ?? []), this];
        return { ...context, ability: this, abilities };
    }
}
