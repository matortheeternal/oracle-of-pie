import Phrase from './Phrase.js';
import SelfReference from './SelfReference.js';
import AttachedReference from './AttachedReference.js';
import NounPhrase from './NounPhrase.js';

const ABILITIES_OF = '(?:each )?(?<kind>activated|triggered|loyalty|mana|ward|exhaust'
    + '|power-up) abilit(?:y|ies) of ';
const ACTIVATED_KIND = '(?:(?<activatedKind>equip|boast|ninjutsu|exhaust|power-up) )?';
const ACTIVATOR = '(?<activator>you|your opponents)';
const ABILITIES_YOU_ACTIVATE = `${ACTIVATED_KIND}abilities ${ACTIVATOR} activate`
    + '(?:(?: that | )(?<filter>target [^,.]+?|aren\'t mana abilities|of [^,.]+?))?'
    + '(?= cost\\b)';
const ABILITIES = new RegExp(`^(?:${ABILITIES_OF}|${ABILITIES_YOU_ACTIVATE})`, 'i');
const FIRST_ACTIVATED = new RegExp(
    '^the first (?<activatedKind>activated) ability you activate during your turn'
        + '(?: that (?<filter>targets? [^,.]+?))?(?= costs?\\b)', 'i'
);
const POSSESSED_ABILITIES = new RegExp(
    '^(?<possessor>~|this [a-z]+|planeswalkers)\'s? (?<kind>equip|loyalty) abilities'
        + '(?: you activate)?(?= costs?\\b)', 'i'
);
const SOURCE_PARSERS = [SelfReference, AttachedReference, NounPhrase];
const TARGET = /^targets?\b/i;

export default class AbilitiesPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(ABILITIES) ?? str.match(FIRST_ACTIVATED)
            ?? str.match(POSSESSED_ABILITIES);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { kind, activatedKind, filter, activator } = match.groups;
        this.abilityKind = (kind ?? activatedKind ?? 'activated').toLowerCase();
        this.isActivatedByYou = !kind && activator !== 'your opponents';
        this.filter = filter ?? null;
        const { possessor } = match.groups;
        this.source = this.readSource(possessor, kind);
    }

    readSource(possessor, kind) {
        if (possessor) return this.parseNext(possessor, SOURCE_PARSERS);
        return kind ? this.consume(SOURCE_PARSERS) : null;
    }

    get children() {
        return this.source ? [this.source] : [];
    }

    get hasTargetingRestriction() {
        return TARGET.test(this.filter ?? '');
    }
}
