import Effect from './Effect.js';

const EXCEPTION = /^damage doesn't cause you to lose life\b/i;
const LIFE_FLOOR = new RegExp(
    '^damage that would reduce your life total to less than (?<threshold>\\d+) '
        + 'reduces it to (?<floor>\\d+) instead\\b',
    'i'
);

export default class DamageLifeExceptionEffect extends Effect {
    static get pattern() {
        return EXCEPTION;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(LIFE_FLOOR);
    }

    parseArguments(match) {
        const { threshold, floor } = match.groups ?? {};
        this.threshold = threshold ? Number(threshold) : null;
        this.minimumLifeAfterDamage = floor ? Number(floor) : null;
    }
}
