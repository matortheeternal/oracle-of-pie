import Effect from './Effect.js';
import { PHRASE_PARSERS } from '../phrases/index.js';
import AssignStatsEffect from './AssignStatsEffect.js';
import SetLifeTotalEffect from './SetLifeTotalEffect.js';
import DefineVariableEffect from './DefineVariableEffect.js';

const DIRECT_CAUSATIVES = [AssignStatsEffect, SetLifeTotalEffect, DefineVariableEffect];

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
        const action = str.slice(match[0].length);
        if (DIRECT_CAUSATIVES.some(parser => parser.match(scribe, action))) return match;
        return causesEffect(scribe, action) ? match : null;
    }

    parseArguments(match) {
        this.inner = this.consume(DIRECT_CAUSATIVES) ?? this.readSubjectAction();
    }

    readSubjectAction() {
        const subject = this.consume(PHRASE_PARSERS);
        if (!subject) return null;
        const action = this.consume(this.scribe.effectParsers);
        if (action) action.subject = subject;
        return action;
    }

    get parts() {
        return [this.inner].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.inner);
    }
}
