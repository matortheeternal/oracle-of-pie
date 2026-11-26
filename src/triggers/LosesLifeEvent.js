import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const AMOUNT = `(?:(?<amount>(?:exactly )?${NUMBER_PATTERN}) )?life\\b`;
const LOSES_LIFE = new RegExp(
    `^(?<subject>.+?)(?: each)? (?<gainsOr>gains? or )?loses? ${AMOUNT}`, 'i'
);
const CAUSED_LOSS = new RegExp(
    `^(?<cause>.+?) causes? (?<subject>you|that player) to lose ${AMOUNT}`, 'i'
);

export default class LosesLifeEvent extends TriggerEvent {
    static get pattern() {
        return LOSES_LIFE;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    static match(scribe, str) {
        return str.match(CAUSED_LOSS) ?? super.match(scribe, str);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.amount = match.groups.amount ?? null;
        this.includesLifeGain = Boolean(match.groups.gainsOr);
        this.cause = match.groups.cause ?? null;
        this.source = this.cause ? this.parseNext(this.cause, PHRASE_PARSERS) : null;
    }

    get children() {
        return [...super.children, this.source].filter(Boolean);
    }

    get isRecognized() {
        if (this.cause && (!this.source || this.source.remainingStr)) return false;
        return super.isRecognized;
    }
}
