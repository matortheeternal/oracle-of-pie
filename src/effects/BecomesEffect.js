import Effect from './Effect.js';
import KeywordList from '../values/KeywordList.js';
import { COPY_EXCEPTION } from '../values/copyException.js';
import NamedModifier from '../phrases/modifiers/NamedModifier.js';

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
const LEADING_COMMA = /^,? /;
const NAMED = /\bnamed /i;

export default class BecomesEffect extends Effect {
    static get pattern() {
        return BECOMES;
    }

    parseArguments(match) {
        this.description = this.consumeText(DESCRIPTION)?.[0] ?? null;
        this.name = this.readName();
        this.keywords = this.parseKeywords();
    }

    readName() {
        const offset = this.description?.search(NAMED) ?? -1;
        if (offset < 0) return null;
        const start = this.description.slice(0, offset);
        const read = this.description.slice(offset);
        const suffix = this.remainingStr.startsWith(',') ? this.remainingStr : '';
        const named = this.parseNext(read + suffix, [NamedModifier]);
        if (named?.raw.length > read.length) {
            this.description = start + named.raw;
            this.remainingStr = named.remainingStr;
        }
        return named;
    }

    consumeDuration() {
        const duration = super.consumeDuration();
        this.exception = this.isCopy ? this.consumeException() : null;
        return duration;
    }

    consumeException() {
        return this.consumeText(COPY_EXCEPTION)?.[0].replace(LEADING_COMMA, '') ?? null;
    }

    parseKeywords() {
        const tail = this.description?.match(WITH_KEYWORDS)?.[1];
        if (!tail) return null;
        const rest = this.remainingStr;
        const keywords = this.parseNext(tail + ' ' + rest, [KeywordList]);
        if (keywords?.remainingStr.length < rest.length) {
            this.remainingStr = keywords.remainingStr;
            this.description += rest.slice(0, rest.length - this.remainingStr.length);
        }
        return keywords;
    }

    get parts() {
        return [this.name, this.keywords].filter(Boolean);
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
