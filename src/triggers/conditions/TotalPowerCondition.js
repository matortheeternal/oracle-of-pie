import StateCondition from './StateCondition.js';

const TOTAL_POWER = new RegExp(
    '^while creatures you control have total power (?<threshold>\\d+) or greater\\b', 'i'
);

export default class TotalPowerCondition extends StateCondition {
    static get pattern() {
        return TOTAL_POWER;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.threshold = Number(match.groups.threshold);
    }
}
