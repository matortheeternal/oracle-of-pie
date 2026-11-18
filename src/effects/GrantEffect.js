import Effect from './Effect.js';
import KeywordList from '../values/KeywordList.js';
import QuotedAbility from '../values/QuotedAbility.js';

const GAINS = /^(?:gains?|has|have) (?=["a-z])/i;
const CONDITION = /^(as long as [^,.]+|during your turn|for each [^,.]+)/i;

export default class GrantEffect extends Effect {
    static get pattern() {
        return GAINS;
    }

    parseArguments(match) {
        this.keywords = this.consume([KeywordList]);
        this.quoted = this.keywords ? null : this.consume([QuotedAbility]);
        this.condition = this.consumeText(CONDITION)?.[1] ?? null;
    }

    get parts() {
        return [this.keywords, this.quoted].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.keywords || this.quoted);
    }

    get grantsKeywords() {
        return Boolean(this.keywords);
    }

    grantsKeyword(name) {
        return Boolean(this.keywords?.names.includes(name));
    }
}
