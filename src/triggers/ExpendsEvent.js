import TriggerEvent from './TriggerEvent.js';

const EXPENDS = /^(?<subject>.+?) expends? (?<mana>\d+)\b/i;

export default class ExpendsEvent extends TriggerEvent {
    static get pattern() {
        return EXPENDS;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.mana = Number(match.groups.mana);
    }
}
