import ObjectEffect from './ObjectEffect.js';

const RETAIN = /^counters remain on /i;
const MOVEMENT = new RegExp(
    '^as it moves to any zone other than a player\'s '
        + '(?<exception>hand or library)\\b', 'i'
);

export default class RetainCountersEffect extends ObjectEffect {
    static get pattern() {
        return RETAIN;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.excludedZones = this.consumeText(MOVEMENT)?.groups.exception ?? null;
    }

    get isComplete() {
        return Boolean(this.excludedZones) && super.isComplete;
    }
}
