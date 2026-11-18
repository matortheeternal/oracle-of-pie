import Parser from '../core/Parser.js';
import { EFFECT_PARSERS } from '../effects/index.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const MAY = /^may /i;
const EACH = /^each /i;

export default class Clause extends Parser {
    static match(scribe, str) {
        return [''];
    }

    static startsEffect(scribe, str) {
        return EFFECT_PARSERS.some(parser => parser.match(scribe, str));
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isOptional = false;
        this.effect = this.consume(EFFECT_PARSERS) ?? this.consumeSubjectEffect();
    }

    consumeSubjectEffect() {
        const start = this.remainingStr;
        const subject = this.consume(PHRASE_PARSERS);
        if (!subject) return null;
        this.isOptional = Boolean(this.consumeText(MAY));
        this.consumeText(EACH);
        const effect = this.consume(EFFECT_PARSERS);
        if (effect) return this.attachSubject(effect, subject);
        this.remainingStr = start;
        return null;
    }

    attachSubject(effect, subject) {
        effect.subject = subject;
        effect.isOptional = this.isOptional;
        return effect;
    }

    get children() {
        return [this.effect].filter(Boolean);
    }

    get isRecognized() {
        return Boolean(this.effect) && super.isRecognized;
    }
}
