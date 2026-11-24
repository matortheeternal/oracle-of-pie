import Phrase from './Phrase.js';
import SelfReference from './SelfReference.js';
import AttachedReference from './AttachedReference.js';
import NounPhrase from './NounPhrase.js';

const ABILITIES_OF = '(?<kind>activated|triggered|loyalty|mana) abilities of ';
const ACTIVATED_KIND = '(?:(?<activatedKind>equip|boast|ninjutsu) )?';
const ABILITIES_YOU_ACTIVATE = `${ACTIVATED_KIND}abilities you activate`
    + '(?:(?: that | )(?<filter>target [^,.]+?|aren\'t mana abilities|of [^,.]+?))?'
    + '(?= cost\\b)';
const ABILITIES = new RegExp(`^(?:${ABILITIES_OF}|${ABILITIES_YOU_ACTIVATE})`, 'i');
const SOURCE_PARSERS = [SelfReference, AttachedReference, NounPhrase];

export default class AbilitiesPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(ABILITIES);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { kind, activatedKind, filter } = match.groups;
        this.abilityKind = (kind ?? activatedKind ?? 'activated').toLowerCase();
        this.isActivatedByYou = !kind;
        this.filter = filter ?? null;
        this.source = kind ? this.consume(SOURCE_PARSERS) : null;
    }

    get children() {
        return this.source ? [this.source] : [];
    }
}
