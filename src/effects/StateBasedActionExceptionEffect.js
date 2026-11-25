import Effect from './Effect.js';

const LOYALTY = new RegExp(
    '^(?:aren\'t|are not) put into their owners\' graveyards? for having '
        + '(?<loyalty>\\d+) loyalty\\b',
    'i'
);

export default class StateBasedActionExceptionEffect extends Effect {
    static get pattern() {
        return LOYALTY;
    }

    parseArguments(match) {
        this.loyalty = Number(match.groups.loyalty);
    }
}
