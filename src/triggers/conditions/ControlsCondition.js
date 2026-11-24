import StateCondition from './StateCondition.js';
import Parser from '../../core/Parser.js';
import { PHRASE_PARSERS } from '../../phrases/index.js';

const CONTROLS = /^while you (?<negated>don't )?control /i;

function readControlled(scribe, str) {
    const parser = new Parser(scribe, null, '');
    return parser.parseNext(str, PHRASE_PARSERS);
}

export default class ControlsCondition extends StateCondition {
    static match(scribe, str) {
        const opening = str.match(CONTROLS);
        if (!opening) return null;
        const controlled = readControlled(scribe, str.slice(opening[0].length));
        if (!controlled?.isRecognized) return null;
        const text = str.slice(0, str.length - controlled.remainingStr.length);
        return Object.assign([text], { groups: opening.groups, controlled });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isNegated = Boolean(match.groups.negated);
        this.controlled = match.controlled;
        this.controlled.markConditionOnly();
    }

    get children() {
        return [this.controlled];
    }
}
