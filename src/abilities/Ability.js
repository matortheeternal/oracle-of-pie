import Parser from '../core/Parser.js';
import EffectSequence from '../statements/EffectSequence.js';
import UnrecognizedText from '../values/UnrecognizedText.js';

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

    get hasAdditionalCost() {
        return false;
    }

    get isModal() {
        return this.modes.length > 1;
    }

    childContext(context) {
        return { ...context, ability: this };
    }
}
