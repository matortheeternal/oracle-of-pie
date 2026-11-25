import Effect from './Effect.js';

const REPEAT = /^faces? that choice an additional time\b/i;

export default class RepeatChoiceEffect extends Effect {
    static get pattern() {
        return REPEAT;
    }

    get additionalChoices() {
        return 1;
    }
}
