import Ability from './Ability.js';
import KeywordList from '../values/KeywordList.js';
import Expansion from '../definitions/Expansion.js';
import Definition from '../definitions/Definition.js';

const LIFE_COST = /\bpay \d+ life\b/i;

const KEYWORD_WITH_COST = /^—(?! )[^.]+\.?$/;
const MANA_COST_CONTINUATION = /^(?:, [^.]+|and\/or (?:\{[^}]+\})+|— \d+\/\d+)\.?$/;
const CARD_NAME = /^[A-Z][^.]*$/;
const PARAMETER = /^(?:[a-z][A-Za-z ,'-]*|with [^.]+)$/;

function isSingle(list) {
    return list.keywords.length === 1;
}

function isKeywordParameter(list, rest) {
    if (!isSingle(list)) return false;
    return PARAMETER.test(rest) || (list.keywords[0].takesName && CARD_NAME.test(rest));
}

function isManaCostContinuation(list, rest) {
    const [keyword] = list.keywords;
    if (!isSingle(list) || !keyword.hasManaParameter) return false;
    return MANA_COST_CONTINUATION.test(rest);
}

function isKeywordRest(list, rest) {
    if (!rest || KEYWORD_WITH_COST.test(rest)) return true;
    return isKeywordParameter(list, rest) || isManaCostContinuation(list, rest);
}

export default class KeywordAbility extends Ability {
    get isKeywordOnly() {
        return true;
    }

    static match(scribe, str) {
        if (!KeywordList.match(scribe, str)) return null;
        const list = KeywordList.parse(scribe, [''], str);
        const rest = list.remainingStr.trim();
        return isKeywordRest(list, rest) ? [''] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.keywords = this.consume([KeywordList]);
        this.costText = this.remainingStr.trim() || null;
        this.remainingStr = '';
    }

    get parts() {
        return [this.keywords];
    }

    get expansions() {
        const keywords = this.keywords.keywords;
        this.cachedExpansions ??= keywords.flatMap(keyword => this.expansionFor(keyword));
        return this.cachedExpansions;
    }

    printedDefinition(keyword) {
        const isSingle = this.keywords.keywords.length === 1;
        if (!isSingle || this.reminders.length !== 1) return null;
        return new Definition({ name: keyword.name, reminder: this.reminders[0] });
    }

    expansionFor(keyword) {
        const registered = this.scribe.definitions.keywords.definitionFor(keyword.name);
        const definition = registered ?? this.printedDefinition(keyword);
        return definition ? [Expansion.of(this.scribe, definition, keyword)] : [];
    }

    hasKeyword(name) {
        const wanted = name.toLowerCase();
        return this.keywords.keywords.some(keyword => keyword.name === wanted);
    }

    hasManaCostKeyword(name) {
        const wanted = name.toLowerCase();
        return this.keywords.keywords
            .some(keyword => keyword.name === wanted && keyword.hasManaParameter);
    }

    get isKeywordAbility() {
        return true;
    }

    get paysLifeCost() {
        return LIFE_COST.test(this.costText ?? '');
    }

    get conferredKeywordNames() {
        return this.keywords.names;
    }
}
