import Sentence from './Sentence.js';
import EffectSequence from './EffectSequence.js';

const BRACKETS = /^\[([^\]]+)\](?:\.)?/;

export default class CleaveSentence extends Sentence {
    static match(scribe, str) {
        const match = this.matchStatement(scribe, str);
        return match ? Object.assign(match, { body: match[1] }) : null;
    }

    static matchStatement(scribe, str) {
        return str.match(BRACKETS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.sequence = EffectSequence.fromText(scribe, match.body);
    }

    get children() {
        return [this.sequence];
    }

    get effects() {
        return this.sequence.effects;
    }

    childContext(context) {
        return { ...super.childContext(context), omittedWhenCleaved: true };
    }
}
