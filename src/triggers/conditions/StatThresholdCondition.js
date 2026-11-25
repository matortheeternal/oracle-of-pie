import StateCondition from './StateCondition.js';

const THRESHOLD = new RegExp(
    '^while (?:its|their) (?<stat>power|toughness) is '
        + '(?<value>\\d+) or (?<direction>greater|less)\\b',
    'i'
);

export default class StatThresholdCondition extends StateCondition {
    static get pattern() {
        return THRESHOLD;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { stat, value, direction } = match.groups;
        this.stat = stat.toLowerCase();
        this.threshold = Number(value);
        this.isMinimum = direction.toLowerCase() === 'greater';
    }
}
