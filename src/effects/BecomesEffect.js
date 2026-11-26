import Effect from './Effect.js';
import Parser from '../core/Parser.js';
import consumeGrantedAbilities, {
    consumeTrailingAbilities
} from '../values/consumeGrantedAbilities.js';
import { COPY_EXCEPTION } from '../values/copyException.js';
import NamedModifier from '../phrases/modifiers/NamedModifier.js';
import PhraseList from '../phrases/PhraseList.js';

const STATE_ALTERNATIVES = [
    'the monarch', 'day\\b', 'night\\b', 'plotted', 'prepared', 'blocked', 'untapped',
    'tapped', 'saddled', 'attached'
];
const BECOMES = new RegExp(`^becomes? (?!${STATE_ALTERNATIVES.join('|')})`, 'i');
const DESCRIPTION = new RegExp(
    '^(?:[^,."]|"[^"]*")+?(?= until | for as long as '
        + '| and (?:gains?|has|have) |,|\\.|$)', 'i'
);
const CREATURE = /\bcreatures?\b/i;
const COPY = /^(?:a )?cop(?:y|ies) of\b/i;
const COPY_FROM = /^(?:a )?cop(?:y|ies) of /i;
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
        this.description = this.readCopyDescription()
            ?? this.consumeText(DESCRIPTION)?.[0] ?? null;
        this.name = this.readName();
        Object.assign(this, this.parseGrantedAbilities());
    }

    readCopyDescription() {
        const start = this.remainingStr;
        const lead = this.consumeText(COPY_FROM);
        if (!lead) return null;
        const objects = this.consume([PhraseList]);
        if (objects?.isRecognized) {
            for (const phrase of objects.phrases) phrase.markConditionOnly();
            this.copyObjects = objects;
            return start.slice(0, start.length - this.remainingStr.length).trimEnd();
        }
        this.remainingStr = start;
        return null;
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

    parseGrantedAbilities() {
        const tail = this.description?.match(WITH_KEYWORDS)?.[1];
        if (!tail) return consumeTrailingAbilities(this);
        const rest = this.remainingStr;
        const separator = rest.startsWith(',') ? '' : ' ';
        const parser = new Parser(this.scribe, null, tail + separator + rest);
        const grants = consumeGrantedAbilities(parser);
        if (!grants.keywords && !grants.quotedAbilities.length)
            return consumeTrailingAbilities(this);
        if (parser.remainingStr.length < rest.length) {
            this.remainingStr = parser.remainingStr;
            this.description += rest.slice(0, rest.length - this.remainingStr.length);
        }
        return grants;
    }

    get parts() {
        const characteristics = [this.name, this.copyObjects, this.keywords];
        return [...characteristics, ...this.quotedAbilities].filter(Boolean);
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
