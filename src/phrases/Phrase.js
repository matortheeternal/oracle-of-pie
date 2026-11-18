import Parser from '../core/Parser.js';

export default class Phrase extends Parser {
    constructor(scribe, match, str) {
        super(scribe, match, str);
        Object.defineProperty(this, 'references', { value: [] });
        Object.defineProperty(this, 'owner', { value: null, writable: true });
    }

    get resolved() {
        return this;
    }

    get isAntecedentCandidate() {
        return !this.isPlayer;
    }

    attachTo(effect) {
        this.owner = effect;
    }
    get refersToSelf() {
        return false;
    }

    get isBackReference() {
        return false;
    }

    get isPlayer() {
        return false;
    }

    get isAnyTarget() {
        return false;
    }

    get controlledByYou() {
        return false;
    }

    get isCardInZone() {
        return false;
    }

    get isMass() {
        return false;
    }

    get isPermanentObject() {
        if (this.refersToSelf || this.isBackReference) return true;
        return this.hasType('creature') || this.hasType('permanent');
    }

    hasType(type) {
        return false;
    }

    hasQualifier(qualifier) {
        return false;
    }
}
