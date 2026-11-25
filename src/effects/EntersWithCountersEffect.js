import Effect from './Effect.js';
import { normalizeCounterKind, isPlusOneKind, lowersToughness } from './counterKinds.js';

const COUNTERS_ON_IT = 'counters?(?: of that kind)? on (?:it|them|him|her)\\b';
const ENTERS_WITH = new RegExp(
    `^(?:enters?|escapes?) (?:the battlefield )?(?:tapped )?with (?=.*${COUNTERS_ON_IT})`,
    'i'
);
const DESCRIPTION = new RegExp(`^(.*?\\b${COUNTERS_ON_IT}(?: equal to [^,.]+)?)`, 'i');
const KIND = /([+\-−]\d+\/[+\-−]\d+|first strike|double strike|[a-z]+) counters?\b/gi;

export default class EntersWithCountersEffect extends Effect {
    static get pattern() {
        return ENTERS_WITH;
    }

    parseArguments(match) {
        this.description = this.consumeText(DESCRIPTION)?.[1] ?? null;
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
