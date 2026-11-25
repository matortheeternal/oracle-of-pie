import Parser from '../../core/Parser.js';

const ORDINALS = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };
const ORDINAL = Object.keys(ORDINALS).join('|');
const ORDINAL_CARD = new RegExp(
    `^(?:your|their) (?<ordinal>${ORDINAL})(?: or (?<alternate>${ORDINAL}))? card\\b`, 'i'
);

export default class OrdinalCard extends Parser {
    static match(scribe, str) {
        return str.match(ORDINAL_CARD);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.ordinal = ORDINALS[match.groups.ordinal.toLowerCase()];
        this.alternateOrdinal = ORDINALS[match.groups.alternate?.toLowerCase()] ?? null;
    }
}
