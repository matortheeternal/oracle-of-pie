import Parser from '../core/Parser.js';
import TrailingCondition from './TrailingCondition.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
import { EFFECT_PARSERS } from '../effects/index.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const CONNECTOR = /^(?:,? ?and then |,? ?then |, and |; |and |, )/i;
const MAY = /^may /i;
const EACH = /^each /i;

function attachSubject(effect, subject, isOptional) {
    effect.subject = subject;
    effect.isOptional = isOptional;
    return effect;
}

export default class ClauseReader extends Parser {
    static read(scribe, text) {
        const reader = new ClauseReader(scribe, null, text);
        reader.readAll();
        return reader;
    }

    static startsClause(scribe, str) {
        return Boolean(new ClauseReader(scribe, null, str).readClause());
    }

    readAll() {
        this.clauseEffects = [this.readClause()];
        while (this.readNextClause()) continue;
        this.condition = this.consume([TrailingCondition]);
        this.unrecognized = this.consume([UnrecognizedText]);
    }

    readNextClause() {
        const connector = this.remainingStr.match(CONNECTOR);
        if (!connector) return false;
        const rest = this.remainingStr.slice(connector[0].length);
        if (!ClauseReader.startsClause(this.scribe, rest)) return false;
        this.consumeText(CONNECTOR);
        this.clauseEffects.push(this.readClause());
        return true;
    }

    readClause() {
        return this.consume(EFFECT_PARSERS) ?? this.readSubjectEffect();
    }

    readSubjectEffect() {
        const start = this.remainingStr;
        const subject = this.consume(PHRASE_PARSERS);
        if (!subject) return null;
        const isOptional = Boolean(this.consumeText(MAY));
        this.consumeText(EACH);
        const effect = this.consume(EFFECT_PARSERS);
        if (effect) return attachSubject(effect, subject, isOptional);
        this.remainingStr = start;
        return null;
    }
}
