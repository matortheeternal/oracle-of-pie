import CardText from './CardText.js';
import CardContext from './core/CardContext.js';
import normalizeCardText from './core/normalizeCardText.js';
import TextLocator from './core/TextLocator.js';
import ParsedCard from './ParsedCard.js';
import { ABILITY_PARSERS, INNER_ABILITY_PARSERS } from './abilities/index.js';
import { RESOLVERS } from './resolvers/index.js';
import { EFFECT_PARSERS } from './effects/index.js';
import { SENTENCE_PARSERS } from './sentences/index.js';
import ClauseReader from './clauses/ClauseReader.js';
import { DEFAULT_KEYWORDS } from './defaultKeywords.js';
import RulesDefinitions from './definitions/RulesDefinitions.js';
import TagLibrary from './evaluators/TagLibrary.js';
import { ACTION_AMOUNT } from './effects/KeywordActionEffect.js';

const NEVER = /(?!)/;
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;
const NAMED_GROUP = /\(\?<(?![=!])\w+>/g;

function alternationPattern(sources, suffix = '') {
    if (!sources.length) return NEVER;
    const unnamed = sources.map(source => source.replace(NAMED_GROUP, '(?:'));
    const unique = [...new Set(unnamed.map(source => source.toLowerCase()))];
    const sorted = unique.sort((a, b) => b.length - a.length);
    return new RegExp(`^(${sorted.join('|')})(?![\\w'-])${suffix}`, 'i');
}

function escapeNames(names) {
    return names.map(name => name.replace(REGEX_SPECIAL, '\\$&'));
}

export default class Oracle {
    constructor({ keywords = DEFAULT_KEYWORDS, definitions = {}, tags = [] } = {}) {
        this.tagLibrary = TagLibrary.withDefaults(tags);
        this.definitions = RulesDefinitions.withDefaults(definitions);
        const keywordSources = escapeNames(keywords)
            .concat(this.definitions.keywords.patternSources);
        this.keywordPattern = alternationPattern(keywordSources);
        this.actionPattern = alternationPattern(
            this.definitions.actions.patternSources, ACTION_AMOUNT
        );
        this.abilityParsers = ABILITY_PARSERS;
        this.innerAbilityParsers = INNER_ABILITY_PARSERS;
        this.effectParsers = EFFECT_PARSERS;
    }

    isKeyword(name) {
        return this.keywordPattern.exec(name)?.[0].length === name.length;
    }

    startsEffect(str) {
        return this.effectParsers.some(parser => parser.match(this, str));
    }

    startsClause(str) {
        return this.startsStatement(str) || ClauseReader.startsClause(this, str);
    }

    startsStatement(str) {
        const openers = SENTENCE_PARSERS.slice(0, -1);
        return openers.some(parser => parser.matchStatement(this, str));
    }

    parseText(text) {
        const cardText = CardText.fromText(this, text);
        for (const resolver of RESOLVERS) resolver.resolve(cardText);
        return cardText;
    }

    parseFace({ text = '', ...metadata }) {
        const card = new CardContext(metadata);
        const { name } = card;
        const parsed = this.parseText(normalizeCardText(text, name));
        const locator = new TextLocator(text, name);
        return new ParsedCard(card, parsed, this.tagLibrary, locator);
    }
}
