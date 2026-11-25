import TriggerEvent from './TriggerEvent.js';

const ROLL = new RegExp(
    '^(?<subject>.+?) rolls? (?<result>one or more dice|a die|a'
        + ' natural \\d+|a \\d+ or higher)\\b', 'i'
);

export default class RollsDiceEvent extends TriggerEvent {
    static get pattern() {
        return ROLL;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.result = match.groups.result.toLowerCase();
    }
}
