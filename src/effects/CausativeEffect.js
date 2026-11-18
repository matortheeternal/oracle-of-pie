import Effect from './Effect.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const HAVE = /^have (?=\S)/i;

function causesEffect(scribe, str) {
    const parser = PHRASE_PARSERS.find(candidate => candidate.match(scribe, str));
    if (!parser) return false;
    const subject = parser.parse(scribe, parser.match(scribe, str), str);
    return scribe.startsEffect(subject.remainingStr);
}

export default class CausativeEffect extends Effect {
    static get pattern() {
        return HAVE;
    }

    static match(scribe, str) {
        const match = str.match(HAVE);
        if (!match) return null;
        return causesEffect(scribe, str.slice(match[0].length)) ? match : null;
    }

    parseArguments(match) {
        const subject = this.consume(PHRASE_PARSERS);
        this.inner = subject ? this.consume(this.scribe.effectParsers) : null;
        if (this.inner) this.inner.subject = subject;
    }

    get parts() {
        return [this.inner].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.inner);
    }
}
