import Phrase from './Phrase.js';
import SelfReference from './SelfReference.js';
import AttachedReference from './AttachedReference.js';
import NounPhrase from './NounPhrase.js';

const ABILITIES = /^(?<kind>activated|triggered|loyalty|mana) abilities of /i;
const SOURCE_PARSERS = [SelfReference, AttachedReference, NounPhrase];

export default class AbilitiesPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(ABILITIES);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.abilityKind = match.groups.kind.toLowerCase();
        this.source = this.consume(SOURCE_PARSERS);
    }

    get parts() {
        return this.source ? [this.source] : [];
    }

    get isComplete() {
        return Boolean(this.source);
    }
}
