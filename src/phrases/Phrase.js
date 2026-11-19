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

    get excludesSelf() {
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

    get isRemainder() {
        return false;
    }

    get controlledByOpponent() {
        return false;
    }

    get hasSubtypes() {
        return false;
    }

    get isAttached() {
        return false;
    }

    get isTargeted() {
        return false;
    }

    get isRelativeGroup() {
        return false;
    }

    get isCommanderGroup() {
        return false;
    }

    get isPermanentObject() {
        if (this.refersToSelf || this.isBackReference) return true;
        return this.hasType('creature') || this.hasType('permanent');
    }

    get isOpposingObject() {
        if (this.refersToSelf || this.controlledByYou) return false;
        if (this.isCardInZone) return false;
        return !this.isPlayer;
    }

    get hitsCreature() {
        if (this.refersToSelf || this.controlledByYou) return false;
        return this.hasType('creature');
    }

    get hitsPlayer() {
        if (this.isPlayer) return Boolean(this.canBeOpponent);
        if (this.isAnyTarget) return true;
        return this.hasExactType('player') || this.hasExactType('opponent');
    }

    get isCreatureCard() {
        return this.hasExactType('creature') && this.isCardInZone;
    }

    hasType(type) {
        return false;
    }

    allowsTypeAlone(type) {
        return this.hasType(type);
    }

    hasExactType(type) {
        return false;
    }

    hasQualifier(qualifier) {
        return false;
    }

    excludesType(type) {
        return false;
    }

    excludesSubtype(subtype) {
        return false;
    }

    excludesQualifier(qualifier) {
        return false;
    }

    requiresKeyword(keyword) {
        return false;
    }

    hasSubtype(subtype) {
        return false;
    }
}
