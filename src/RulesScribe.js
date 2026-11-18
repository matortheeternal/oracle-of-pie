import CardText from './CardText.js';
import CardContext from './core/CardContext.js';
import normalizeCardText from './core/normalizeCardText.js';
import ParsedCard from './ParsedCard.js';
import { ABILITY_PARSERS, INNER_ABILITY_PARSERS } from './abilities/index.js';
import { RESOLVERS } from './resolvers/index.js';
import { EFFECT_PARSERS } from './effects/index.js';
import { STATEMENT_PARSERS } from './statements/index.js';
import Clause from './clauses/Clause.js';
import { DEFAULT_KEYWORDS } from './defaultKeywords.js';
import RulesDefinitions from './definitions/RulesDefinitions.js';
import TagLibrary from './evaluators/TagLibrary.js';

const NEVER = /(?!)/;
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

function alternationPattern(sources) {
    if (!sources.length) return NEVER;
    const unique = [...new Set(sources.map(source => source.toLowerCase()))];
    const sorted = unique.sort((a, b) => b.length - a.length);
    return new RegExp(`^(${sorted.join('|')})(?![\\w'-])`, 'i');
}

function escapeNames(names) {
    return names.map(name => name.replace(REGEX_SPECIAL, '\\$&'));
}

export default class RulesScribe {
    constructor({ keywords = DEFAULT_KEYWORDS, definitions = {}, tags = [] } = {}) {
        this.tagLibrary = TagLibrary.withDefaults(tags);
        this.definitions = RulesDefinitions.withDefaults(definitions);
        const keywordSources = escapeNames(keywords)
            .concat(this.definitions.keywords.patternSources);
        this.keywordPattern = alternationPattern(keywordSources);
        this.actionPattern = alternationPattern(this.definitions.actions.patternSources);
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
        return this.startsStatement(str) || Boolean(Clause.parse(this, [''], str).effect);
    }

    startsStatement(str) {
        return STATEMENT_PARSERS.slice(0, -1).some(parser => parser.match(this, str));
    }

    parseText(text) {
        const cardText = CardText.fromText(this, text);
        for (const resolver of RESOLVERS) resolver.resolve(cardText);
        return cardText;
    }

    parseFace({ name = '', typeLine = '', text = '', loyalty = null, faceCount = 1 }) {
        const card = new CardContext({ name, typeLine, loyalty, faceCount });
        const parsed = this.parseText(normalizeCardText(text, name));
        return new ParsedCard(card, parsed, this.tagLibrary);
    }
}
