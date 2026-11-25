import Effect from './Effect.js';
import { normalizeCounterKind, isPlusOneKind, lowersToughness } from './counterKinds.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const COUNTERS_ON_IT = 'counters?(?: of that kind)? on (?:it|them|him|her)\\b';
const ENTERS_WITH = new RegExp(
    `^(?:enters?|escapes?) (?:the battlefield )?(?:tapped )?with (?=.*${COUNTERS_ON_IT})`,
    'i'
);
const DESCRIPTION = new RegExp(`^(.*?\\b${COUNTERS_ON_IT}(?: equal to [^,.]+)?)`, 'i');
const KIND = /([+\-−]\d+\/[+\-−]\d+|first strike|double strike|[a-z]+) counters?\b/gi;
const TIME_COUNTERS = `${NUMBER_PATTERN} time counters?\\b(?! on )`;
const COUNTER_CHOICE = 'your choice of an? (?:additional )?\\+1/\\+1 counter '
    + 'or (?<alternative>haste)\\b';
const IMPLICIT_RECIPIENT = new RegExp(`^(?:${TIME_COUNTERS}|${COUNTER_CHOICE})`, 'i');
const ENTERS = /^enters? with /i;

export default class EntersWithCountersEffect extends Effect {
    static get pattern() {
        return ENTERS_WITH;
    }

    static match(scribe, str) {
        const explicit = super.match(scribe, str);
        if (explicit) return explicit;
        const enters = str.match(ENTERS);
        if (!enters) return null;
        return IMPLICIT_RECIPIENT.test(str.slice(enters[0].length)) ? enters : null;
    }

    parseArguments(match) {
        const counters = this.consumeText(DESCRIPTION)
            ?? this.consumeText(IMPLICIT_RECIPIENT);
        this.description = counters?.[0] ?? null;
        this.alternativeKeyword = counters?.groups?.alternative?.toLowerCase() ?? null;
    }

    get kinds() {
        const matches = [...(this.description ?? '').matchAll(KIND)];
        return matches.map(([, kind]) => normalizeCounterKind(kind.toLowerCase()));
    }

    get isComplete() {
        return Boolean(this.description);
    }

    get phrases() {
        return [this.subject].filter(Boolean);
    }

    get isPlusCounters() {
        return this.kinds.some(isPlusOneKind);
    }

    get isMinusCounters() {
        return this.kinds.some(lowersToughness);
    }

    get keywordCounterNames() {
        return this.kinds.filter(kind => this.scribe.isKeyword(kind));
    }

    get conferredKeywordNames() {
        return this.keywordCounterNames;
    }
}
