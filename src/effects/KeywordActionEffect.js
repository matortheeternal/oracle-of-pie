import Effect from './Effect.js';
import Expansion from '../definitions/Expansion.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const KEYWORD_ACTION_ALTERNATIVES = [
    'scry', 'surveil', 'investigate', 'proliferate', 'explores?', 'connives?', 'populate',
    'learn', 'amass [A-Z][a-z]+', 'adapt', 'bolster', 'support', 'incubate', 'discover',
    'seek', 'endure', 'manifest dread', 'manifest', 'venture into the dungeon',
    'the ring tempts you', 'become the monarch', 'take the initiative', 'goad [^,.]+',
    'transform [^,.]+', 'regenerate [^,.]+', 'shuffle(?: [^,.]*)?', 'time travel',
    'forage', 'collect evidence', 'exert [^,.]+'
];
const KEYWORD_ACTION = new RegExp(
    `^(${KEYWORD_ACTION_ALTERNATIVES.join('|')})(?![\\w])(?: (${NUMBER_PATTERN}))?`, 'i'
);

const THIRD_PERSON = /(?<=connive|explore)s$/;

export default class KeywordActionEffect extends Effect {
    static get pattern() {
        return KEYWORD_ACTION;
    }

    static match(scribe, str) {
        return str.match(KEYWORD_ACTION) ?? str.match(scribe.actionPattern);
    }

    get expansions() {
        const definition = this.scribe.definitions.actions.definitionFor(this.action);
        this.cachedExpansions ??= definition
            ? [Expansion.of(this.scribe, definition, this)]
            : [];
        return this.cachedExpansions;
    }

    parseArguments(match) {
        this.action = match[1].toLowerCase().split(' ')[0].replace(THIRD_PERSON, '');
        this.amountText = match[2] ?? null;
    }
}
