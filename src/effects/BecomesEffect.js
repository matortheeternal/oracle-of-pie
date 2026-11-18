import Effect from './Effect.js';
import KeywordList from '../values/KeywordList.js';

const STATE_ALTERNATIVES = [
    'the monarch', 'day\\b', 'night\\b', 'plotted', 'prepared', 'blocked', 'untapped',
    'tapped', 'saddled', 'attached'
];
const BECOMES = new RegExp(`^becomes? (?!${STATE_ALTERNATIVES.join('|')})`, 'i');
const DESCRIPTION = /^(?:[^,."]|"[^"]*")+?(?= until | for as long as |,|\.|$)/i;
const CREATURE = /\bcreatures?\b/i;
const POWER_TOUGHNESS = /\b\d+\/\d+\b/;
const WITH_KEYWORDS = /\bwith (.+)$/i;

export default class BecomesEffect extends Effect {
    static get pattern() {
        return BECOMES;
    }

    parseArguments(match) {
        this.description = this.consumeText(DESCRIPTION)?.[0] ?? null;
        this.keywords = this.parseKeywords();
    }

    parseKeywords() {
        const tail = this.description?.match(WITH_KEYWORDS)?.[1];
        return tail ? this.parseNext(tail, [KeywordList]) : null;
    }

    get parts() {
        return [this.keywords].filter(Boolean);
    }

    get grantedKeywordNames() {
        return this.keywords?.names ?? [];
    }

    get conferredKeywordNames() {
        return this.grantedKeywordNames;
    }

    get isComplete() {
        return Boolean(this.description);
    }

    get becomesCreature() {
        return CREATURE.test(this.description ?? '');
    }

    get setsPowerToughness() {
        return POWER_TOUGHNESS.test(this.description ?? '');
    }
}
