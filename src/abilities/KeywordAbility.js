import Ability from './Ability.js';
import KeywordList from '../values/KeywordList.js';
import Expansion from '../definitions/Expansion.js';
import Definition from '../definitions/Definition.js';

const KEYWORD_WITH_COST = /^—(?:[^.]+\.?)$/;
const PARAMETER = /^[a-z][a-z ,'-]*$/;

function isKeywordParameter(list, rest) {
    return list.keywords.length === 1 && PARAMETER.test(rest);
}

function isKeywordRest(list, rest) {
    return !rest || KEYWORD_WITH_COST.test(rest) || isKeywordParameter(list, rest);
}

export default class KeywordAbility extends Ability {
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

    get isKeywordAbility() {
        return true;
    }
}
