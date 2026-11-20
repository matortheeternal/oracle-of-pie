import Parser from '../../core/Parser.js';
import { PHRASE_PARSERS } from '../../phrases/index.js';

const ABILITY_KIND = '(?:(?<kind>[a-z-]+(?: or [a-z-]+)?) )?';
const ABILITY = new RegExp(`^(?:an?|one or more) ${ABILITY_KIND}abilit(?:y|ies)\\b`, 'i');
const OF_SOURCE = /^of /i;
const NONMANA = /^that (?:isn't|aren't) (?:a )?mana abilit(?:y|ies)\b/i;

export default class ActivatedAbilityPhrase extends Parser {
    static match(scribe, str) {
        return str.match(ABILITY);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.abilityKind = match.groups.kind?.toLowerCase() ?? null;
        this.source = this.readSource();
        this.isNonmana = Boolean(this.consumeText(NONMANA));
    }

    readSource() {
        if (!OF_SOURCE.test(this.remainingStr)) return null;
        const text = this.remainingStr.replace(OF_SOURCE, '');
        const source = this.parseNext(text, PHRASE_PARSERS);
        if (!source?.isRecognized) return null;
        this.remainingStr = source.remainingStr;
        return source;
    }

    get children() {
        return [this.source].filter(Boolean);
    }
}
