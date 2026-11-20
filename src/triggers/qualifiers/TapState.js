import Parser from '../../core/Parser.js';

const TAP_STATE = /^(?<state>untapped|tapped)\b/i;
const UNTAPPED = 'untapped';

export default class TapState extends Parser {
    static match(scribe, str) {
        return str.match(TAP_STATE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.state = match.groups.state.toLowerCase();
    }

    get isUntapped() {
        return this.state === UNTAPPED;
    }
}
