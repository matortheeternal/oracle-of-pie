import Effect from './Effect.js';

const ADDITIONAL_TRIGGER = /^(?:that ability|it) triggers an additional time/i;

export default class AdditionalTriggerEffect extends Effect {
    static get pattern() {
        return ADDITIONAL_TRIGGER;
    }
}
