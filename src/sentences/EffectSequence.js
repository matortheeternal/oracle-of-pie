import Parser from '../core/Parser.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
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
        this.unrecognized = this.consume([UnrecognizedText]);
    }

    get children() {
        return [...this.sentences, this.unrecognized].filter(Boolean);
    }

    get effects() {
        return this.sentences.flatMap(sentence => sentence.effects);
    }
}
