import Sentence from './Sentence.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const TOKEN_EVENT = /^create (?:a|an|one or more) (?<token>[\w ,/-]+) tokens?$/i;
const TOKEN_JOINER = /,? (?:and|or) |, /i;
const MILL_ACTION = /^mill\b/i;
const WOULD_DIE = /^die\b/i;
const DAMAGED_SUBJECT = /\bdealt (?:combat )?damage\b/i;
const SCRY_ACTION = /^scry\b/i;
const GAIN_LIFE_ACTION = /^gain life\b/i;
const LOSE_LIFE_ACTION = /^lose life\b/i;
const WOULD_ENTER_GRAVEYARD = new RegExp(
    '^if (a (?:black|red) or (?:black|red) permanent, spell, '
        + 'or card not on the battlefield)'
        + ' would (be put into a graveyard), (?=exile it instead)', 'i'
);
const REPLACEMENT = new RegExp(
    '^(?:if|the next time) ([^,"]+?) would ([^,"]+),'
        + ' (?=[^.]*\\binstead\\b)', 'i'
);
const EVENT_CONTINUATION = new RegExp(
    '^(?:and |or |[A-Z][\\w-]+(?:,| or )|(?:battle|spell|creature|player),|card not on )'
);
const COMMA = ', ';

function extendReplacement(scribe, text, initial) {
    const start = initial[0].length;
    let stop = start;
    while (EVENT_CONTINUATION.test(text.slice(stop))) {
        const next = text.indexOf(COMMA, stop);
        if (next < 0) break;
        stop = next + COMMA.length;
        if (!scribe.startsModeledClause(text.slice(stop))) continue;
        const action = initial[2] + text.slice(start - COMMA.length, next);
        return [text.slice(0, stop), initial[1], action];
    }
    return initial;
}

export default class ReplacementSentence extends Sentence {
    static matchStatement(scribe, text) {
        const zoneReplacement = text.match(WOULD_ENTER_GRAVEYARD);
        if (zoneReplacement) return zoneReplacement;
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
        const tokens = action.match(TOKEN_EVENT)?.groups.token;
        this.replacedTokens = tokens?.split(TOKEN_JOINER) ?? [];
        this.replacedToken = this.replacedTokens.length === 1
            ? this.replacedTokens[0] : null;
        this.readClauses(match.rest);
    }

    get referenceSeeds() {
        return [this.affectedObject].filter(Boolean);
    }

    childContext(context) {
        return { ...super.childContext(context), replacement: this };
    }
}
