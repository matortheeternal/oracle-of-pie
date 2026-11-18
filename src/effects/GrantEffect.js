import Effect from './Effect.js';
import consumeGrantedAbilities from '../values/consumeGrantedAbilities.js';

const GAINS = /^(?:gains?|has|have) (?=["a-z])/i;
const CONDITION = /^(as long as [^,.]+|during your turn|for each [^,.]+)/i;

export default class GrantEffect extends Effect {
    static get pattern() {
        return GAINS;
    }

    parseArguments(match) {
        Object.assign(this, consumeGrantedAbilities(this));
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

    get grantedKeywordNames() {
        return this.keywords?.names ?? [];
    }

    grantsKeyword(name) {
        return Boolean(this.keywords?.names.includes(name));
    }
}
