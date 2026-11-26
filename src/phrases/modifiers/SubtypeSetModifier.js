import Modifier from './Modifier.js';

const SUBTYPE = '[A-Z][a-z]+(?:-[A-Z]?[a-z]+)?';
const CARD_KIND = 'artifact|creature|land|enchantment|permanent|planeswalker|battle';
const TYPE = `(?:${SUBTYPE}|${CARD_KIND})`;
export const SUBTYPE_CHOICES = `${TYPE}(?:, ${TYPE})*,? or ${TYPE}`;
const TYPE_SET = new RegExp(
    `^that(?:'s| is| are| isn't| aren't) an? (?<types>${SUBTYPE_CHOICES})\\b`
);
const SEPARATOR = /,? or |, /;
const EXCLUSION = /n't /;

export default class SubtypeSetModifier extends Modifier {
    static match(scribe, str) {
        return str.match(TYPE_SET);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.subtypes = match.groups.types.split(SEPARATOR);
        this.negated = EXCLUSION.test(match[0]);
    }

    get restrictsSubtype() {
        return true;
    }
}
