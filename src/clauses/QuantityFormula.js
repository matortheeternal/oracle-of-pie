import Parser from '../core/Parser.js';
import PhraseList from '../phrases/PhraseList.js';

const COUNT = /^the number of /i;
const ADJUSTMENT = /^(?:(?<offset>\d+) plus |(?<double>twice) )/i;
const PROPERTY = new RegExp(
    '^(?<object>.+?)(?:\'s|s\') (?<property>mana value|power|toughness)$',
    'i'
);
const POSSESSIVE_PROPERTY = new RegExp(
    '^(?<object>its|their) (?<property>mana value|power|toughness)$', 'i'
);

export default class QuantityFormula extends Parser {
    static match(scribe, str) {
        const adjustment = str.match(ADJUSTMENT);
        const term = str.slice(adjustment?.[0].length ?? 0);
        const count = term.match(COUNT);
        const property = term.match(PROPERTY) ?? term.match(POSSESSIVE_PROPERTY);
        if (!count && !property) return null;
        return Object.assign([str], { adjustment, term, count, property });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { adjustment, term, count, property } = match;
        this.offset = Number(adjustment?.groups.offset ?? 0);
        this.multiplier = adjustment?.groups.double ? 2 : 1;
        this.operation = count ? 'count' : 'property';
        this.property = property?.groups.property.toLowerCase() ?? null;
        this.objectText = count ? term.slice(count[0].length) : property.groups.object;
        const objects = this.parseNext(this.objectText, [PhraseList]);
        this.objects = objects?.isRecognized && !objects.remainingStr ? objects : null;
    }

    get children() {
        return [this.objects].filter(Boolean);
    }
}
