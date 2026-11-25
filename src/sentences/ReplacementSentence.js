import Sentence from './Sentence.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const TOKEN_EVENT = /^create (?:a|an|one or more) (?<token>[\w ]+) tokens?$/i;
const MILL_ACTION = /^mill\b/i;
const WOULD_DIE = /^die\b/i;
const DAMAGED_SUBJECT = /\bdealt (?:combat )?damage\b/i;
const SCRY_ACTION = /^scry\b/i;
const GAIN_LIFE_ACTION = /^gain life\b/i;
const LOSE_LIFE_ACTION = /^lose life\b/i;
const REPLACEMENT = new RegExp(
    '^(?:if|the next time) ([^,"]+?) would ([^,"]+),'
        + ' (?=[^.]*\\binstead\\b)', 'i'
);
const EVENT_CONTINUATION = /^(?:and |or |[A-Z][\w-]+(?:,| or ))/;
const COMMA = ', ';

function extendReplacement(scribe, text, initial) {
    const stop = initial[0].length;
    if (!EVENT_CONTINUATION.test(text.slice(stop))) return initial;
    const next = text.indexOf(COMMA, stop);
    if (next < 0 || !scribe.startsClause(text.slice(next + COMMA.length))) return initial;
    const end = next + COMMA.length;
    return [text.slice(0, end), initial[1], initial[2] + text.slice(stop - 2, next)];
}

export default class ReplacementSentence extends Sentence {
    static matchStatement(scribe, text) {
        const match = text.match(REPLACEMENT);
        return match ? extendReplacement(scribe, text, match) : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const [, subject, action] = match.statement;
        this.isDamageCleanup = WOULD_DIE.test(action) && DAMAGED_SUBJECT.test(subject);
        this.replacesMill = MILL_ACTION.test(action);
        this.replacesScry = SCRY_ACTION.test(action);
        this.replacesLifeGain = GAIN_LIFE_ACTION.test(action);
        this.replacesLifeLoss = LOSE_LIFE_ACTION.test(action);
        this.event = subject + ' would ' + action;
        this.affectedObject = this.parseNext(subject, PHRASE_PARSERS);
        this.replacedToken = action.match(TOKEN_EVENT)?.groups.token ?? null;
        this.readClauses(match.rest);
    }

    get referenceSeeds() {
        return [this.affectedObject].filter(Boolean);
    }

    childContext(context) {
        return { ...super.childContext(context), replacement: this };
    }
}
