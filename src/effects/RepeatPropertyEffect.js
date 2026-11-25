import ObjectEffect from './ObjectEffect.js';
import KeywordList from '../values/KeywordList.js';

const SAME_AS_PREVIOUS = /^(?:the same is true for|do the same for) /i;

export default class RepeatPropertyEffect extends ObjectEffect {
    static get pattern() {
        return SAME_AS_PREVIOUS;
    }

    parseArguments() {
        this.keywords = this.consume([KeywordList]);
        if (!this.keywords) super.parseArguments();
    }

    get isComplete() {
        return this.keywords !== null || super.isComplete;
    }

    get parts() {
        return [...super.parts, this.keywords].filter(Boolean);
    }
}
