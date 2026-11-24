import Phrase from './Phrase.js';
import NounPhrase from './NounPhrase.js';

const YOU_AND_OBJECTS = /^you and (?=(?:other )?[a-z]+ you control\b)/i;

export default class YouAndYourObjects extends Phrase {
    static match(scribe, str) {
        return str.match(YOU_AND_OBJECTS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.objects = this.consume([NounPhrase]);
    }

    get children() {
        return this.objects ? [this.objects] : [];
    }

    get includesYou() {
        return true;
    }

    get canBeYou() {
        return true;
    }

    get controlledByYou() {
        return Boolean(this.objects?.controlledByYou);
    }

    get isMass() {
        return Boolean(this.objects?.isMass);
    }

    hasType(type) {
        return Boolean(this.objects?.hasType(type));
    }

    hasExactType(type) {
        return Boolean(this.objects?.hasExactType(type));
    }
}
