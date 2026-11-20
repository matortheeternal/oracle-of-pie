import Effect from './Effect.js';
import KeywordList from '../values/KeywordList.js';

const STATE_ALTERNATIVES = [
    'the monarch', 'day\\b', 'night\\b', 'plotted', 'prepared', 'blocked', 'untapped',
    'tapped', 'saddled', 'attached'
];
const BECOMES = new RegExp(`^becomes? (?!${STATE_ALTERNATIVES.join('|')})`, 'i');
const DESCRIPTION = /^(?:[^,."]|"[^"]*")+?(?= until | for as long as |,|\.|$)/i;
const CREATURE = /\bcreatures?\b/i;
const COPY = /^(?:a )?cop(?:y|ies) of\b/i;
const COLOR = '(?:white|blue|black|red|green|colorless)';
const STATS_PREFIX = '(?:(?:[0-9]+|X)/(?:[0-9]+|X) )?';
const COLOR_DESCRIPTION = new RegExp(
    `^(?:(?:an? )?${STATS_PREFIX}${COLOR}\\b`
        + '|(?:the chosen color|the color of your choice|that color|all colors)$)',
    'i'
);
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

    get isCopy() {
        return COPY.test(this.description ?? '');
    }

    get setsColor() {
        return !this.isCopy && COLOR_DESCRIPTION.test(this.description ?? '');
    }

    get becomesCreature() {
        const description = this.description ?? '';
        return !COPY.test(description) && CREATURE.test(description);
    }

    get setsPowerToughness() {
        return POWER_TOUGHNESS.test(this.description ?? '');
    }
}
