import Parser from '../../core/Parser.js';

const CONTROL = `under (?<controller>your|an opponent's|its owner's) control`;
const BASE_PT = '(?:power and toughness|power) (?<basePT>[0-9]+(?:/[0-9]+)?)';
const ARRIVAL_STATE = '(?<state>transformed|attacking)';
const ARRIVAL = new RegExp(
    `^(?:the battlefield )?(?:${CONTROL}|with base ${BASE_PT}|${ARRIVAL_STATE})`
        + '\\b',
    'i'
);

export default class Arrival extends Parser {
    static match(scribe, str) {
        return str.match(ARRIVAL);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.controller = match.groups.controller?.toLowerCase() ?? null;
        this.basePT = match.groups.basePT ?? null;
        this.state = match.groups.state?.toLowerCase() ?? null;
    }
}
