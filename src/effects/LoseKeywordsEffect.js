import Effect from './Effect.js';
import KeywordList from '../values/KeywordList.js';

const LOSES = /^loses? (?=[a-z])/i;

export default class LoseKeywordsEffect extends Effect {
    static get pattern() {
        return LOSES;
    }

    parseArguments(match) {
        this.keywords = this.consume([KeywordList]);
    }

    get parts() {
        return [this.keywords].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.keywords);
    }

    get lostKeywordNames() {
        return this.keywords?.names ?? [];
    }
}
