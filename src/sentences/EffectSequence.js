import Parser from '../core/Parser.js';
import { SENTENCE_PARSERS } from './index.js';

export default class EffectSequence extends Parser {
    static fromText(scribe, text) {
        return EffectSequence.parse(scribe, [''], text);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.sentences = this.consumeAll(SENTENCE_PARSERS, []);
        this.sentences.forEach((sentence, index) => sentence.link(
            this.sentences[index - 1],
            this.sentences[index + 1]
        ));
    }

    get children() {
        return this.sentences;
    }

    get effects() {
        return this.sentences.flatMap(sentence => sentence.effects);
    }
}
